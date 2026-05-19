from __future__ import annotations

from app.ai.prompts import SYSTEM_PROMPT, build_user_prompt
from app.ai.router import Provider, get_llm_client
from app.ai.schemas import AnalysisOutput
from app.utils.text_utils import normalize_text


_DEFAULT_PROCESS_BY_CATEGORY: dict[str, list[str]] = {
    "Kira Hukuku": ["Yazılı talep gönder", "Arabuluculuk başvurusu", "Dava aç"],
    "İş Hukuku": ["Delil/toplam kayıtları düzenle", "Arabuluculuk başvurusu", "Dava aç"],
    "Tüketici Hukuku": ["Satıcıya yazılı başvuru yap", "Tüketici Hakem Heyeti başvurusu", "Dava aç"],
    "Borçlar Hukuku": ["Yazılı ihtar gönder", "Arabuluculuk/uzlaşma dene", "Dava/İcra yoluna başvur"],
    "Aile Hukuku": ["Gerekli belgeleri topla", "Arabuluculuk/uzlaşma değerlendirmesi", "Dava aç"],
}


class AnalysisEngine:
    async def analyze(
        self,
        *,
        text: str,
        provider: Provider | None,
        model: str | None,
        retrieval_context: str | None,
    ) -> tuple[AnalysisOutput, str, str]:
        clean_text = normalize_text(text)
        client = get_llm_client(provider=provider, model=model)
        data = await client.chat_json(system=SYSTEM_PROMPT, user=build_user_prompt(clean_text, retrieval_context))
        out = AnalysisOutput.model_validate(data)
        if not out.recommended_process:
            out.recommended_process = _DEFAULT_PROCESS_BY_CATEGORY.get(out.legal_category, [])
        return out, client.provider, client.model

