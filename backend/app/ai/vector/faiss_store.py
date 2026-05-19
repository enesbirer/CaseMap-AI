from __future__ import annotations

import asyncio
import json
from pathlib import Path

import faiss
import numpy as np

from app.config.settings import settings
from app.utils.file_utils import ensure_dir


class FaissStore:
    def __init__(self):
        self._lock = asyncio.Lock()
        self._index: faiss.Index | None = None
        self._dim: int | None = None

    async def ensure_loaded(self, dim: int) -> None:
        async with self._lock:
            if self._index is not None:
                return
            self._dim = dim
            ensure_dir(settings.faiss_index_path.parent)
            if settings.faiss_index_path.exists():
                self._index = faiss.read_index(str(settings.faiss_index_path))
            else:
                self._index = faiss.IndexFlatIP(dim)
                faiss.write_index(self._index, str(settings.faiss_index_path))
            self._write_metadata()

    async def add(self, vectors: np.ndarray) -> list[int]:
        if vectors.ndim != 2:
            raise ValueError("Vektör şekli hatalı")
        await self.ensure_loaded(vectors.shape[1])
        async with self._lock:
            assert self._index is not None
            start = self._index.ntotal
            self._index.add(vectors)
            faiss.write_index(self._index, str(settings.faiss_index_path))
            self._write_metadata()
            return list(range(start, start + vectors.shape[0]))

    async def search(self, query_vector: np.ndarray, top_k: int) -> list[tuple[int, float]]:
        if query_vector.ndim == 1:
            query_vector = query_vector.reshape(1, -1)
        await self.ensure_loaded(query_vector.shape[1])
        async with self._lock:
            assert self._index is not None
            scores, ids = self._index.search(query_vector.astype("float32"), top_k)
            results: list[tuple[int, float]] = []
            for idx, score in zip(ids[0].tolist(), scores[0].tolist(), strict=False):
                if idx == -1:
                    continue
                results.append((int(idx), float(score)))
            return results

    def _write_metadata(self) -> None:
        if self._index is None:
            return
        meta = {"dimension": self._index.d, "count": int(self._index.ntotal)}
        ensure_dir(settings.faiss_metadata_path.parent)
        Path(settings.faiss_metadata_path).write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")


faiss_store = FaissStore()

