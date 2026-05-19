from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.embedding_service import EmbeddingService
from app.ai.vector.faiss_store import faiss_store
from app.models.document_chunk import DocumentChunk
from app.config.settings import settings


class RetrievalService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.embedder = EmbeddingService()

    async def retrieve_context(self, query: str, top_k: int | None = None) -> str | None:
        top_k = top_k or settings.retrieval_top_k
        vectors = await self.embedder.embed_texts([query])
        results = await faiss_store.search(vectors[0], top_k=top_k)
        if not results:
            return None

        vector_ids = [vid for vid, _ in results]
        rows = await self.db.execute(select(DocumentChunk).where(DocumentChunk.vector_id.in_(vector_ids)))
        chunks = rows.scalars().all()
        by_vector = {c.vector_id: c for c in chunks}

        parts: list[str] = []
        for vid, score in results:
            chunk = by_vector.get(vid)
            if not chunk:
                continue
            parts.append(f"[score={score:.3f}] {chunk.text}")
        return "\n".join(parts).strip() or None

