from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.embedding_service import EmbeddingService
from app.ai.vector.faiss_store import faiss_store
from app.models.document_chunk import DocumentChunk
from app.models.uploaded_file import UploadedFile
from app.utils.file_utils import chunk_text


class IndexingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.embedder = EmbeddingService()

    async def index_uploaded_file(self, file: UploadedFile) -> int:
        chunks = chunk_text(file.extracted_text)
        if not chunks:
            return 0
        vectors = await self.embedder.embed_texts(chunks)
        vector_ids = await faiss_store.add(vectors)

        records = [
            DocumentChunk(file_id=file.id, chunk_index=i, text=chunk, vector_id=vector_id)
            for i, (chunk, vector_id) in enumerate(zip(chunks, vector_ids, strict=False))
        ]
        self.db.add_all(records)
        await self.db.commit()
        return len(records)

