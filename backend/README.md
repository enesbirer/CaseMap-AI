# CaseMap AI Backend

FastAPI + PostgreSQL + FAISS tabanlı, yapılandırılmış hukuki vaka analizi ve süreç önerisi backend’i.

## Özellikler

- JWT Authentication: Register / Login / Me
- Vaka Analizi: metin, dosya (PDF/DOCX/TXT) ve ses (opsiyonel) üzerinden analiz
- AI Sağlayıcıları:
  - Ücretli: OpenAI (GPT-4o uyumlu)
  - Ücretsiz: Ollama (lokal/ ücretsiz çalışma)
- Embedding: sentence-transformers
- Vector Search: FAISS (gelecekte RAG için hazır)
- Dosya yükleme ve metin çıkarma
- Rate limiting, CORS, request-id, merkezi logging, yapılandırılmış hata dönüşleri

## Kurulum (Docker ile önerilen)

1) Ortam dosyasını oluştur:

```bash
cd backend
copy .env.example .env
```

2) Servisleri başlat:

```bash
docker compose up --build
```

3) Ollama modelini indir (ilk sefer):

```bash
docker exec -it backend-ollama-1 ollama pull llama3.1:8b
```

API:
- Swagger: http://localhost:8000/api/v1/docs
- OpenAPI: http://localhost:8000/api/v1/openapi.json

## Postman ile Kullanım

Base URL: `http://localhost:8000/api/v1`

### 1) Register

`POST /auth/register`

```json
{
  "email": "test@example.com",
  "password": "StrongPass123!"
}
```

### 2) Login

`POST /auth/login`

```json
{
  "email": "test@example.com",
  "password": "StrongPass123!"
}
```

Response içindeki `access_token` ile Authorization header:

`Authorization: Bearer <token>`

### 3) Me

`GET /auth/me`

### 4) Metin Analizi

`POST /cases/analyze`

```json
{
  "text": "Ev sahibim depozitomu geri vermiyor.",
  "provider": "ollama",
  "model": "llama3.1:8b",
  "retrieval": true
}
```

### 5) Dosya Analizi

`POST /cases/analyze-file` (multipart/form-data)

- Key: `file` (PDF/DOCX/TXT)
- Query Params (opsiyonel): `provider`, `model`, `retrieval`

### 6) Ses Analizi (opsiyonel)

`POST /cases/analyze-audio` (multipart/form-data)

- Key: `audio`

## Model Değiştirme

- Varsayılan sağlayıcı: `.env` içinde `LLM_PROVIDER_DEFAULT`
- İstek bazında değiştirme: `/cases/analyze` body içindeki `provider` ve `model`

Örnek:
- Ücretsiz: `provider=ollama`, `model=llama3.1:8b`
- Ücretli: `provider=openai`, `model=gpt-4o-mini` ve `OPENAI_API_KEY` tanımlı olmalı

