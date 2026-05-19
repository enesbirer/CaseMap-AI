from __future__ import annotations

import asyncio
from functools import lru_cache

import numpy as np
from sentence_transformers import SentenceTransformer

from app.config.settings import settings


@lru_cache(maxsize=1)
def _get_model() -> SentenceTransformer:
    return SentenceTransformer(settings.embedding_model_name)


class EmbeddingService:
    async def embed_texts(self, texts: list[str]) -> np.ndarray:
        model = _get_model()
        vectors = await asyncio.to_thread(model.encode, texts, normalize_embeddings=True)
        return np.asarray(vectors, dtype="float32")

