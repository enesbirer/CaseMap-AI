from __future__ import annotations

LEGAL_CATEGORIES = ["İş Hukuku", "Kira Hukuku", "Tüketici Hukuku", "Borçlar Hukuku", "Aile Hukuku"]


SYSTEM_PROMPT = f"""
Sen bir LegalTech analiz motorusun. Görevin sohbet etmek değil; kullanıcı anlatımını yapılandırılmış vaka verisine dönüştürmek.

Kurallar:
- Sadece geçerli JSON döndür.
- JSON dışında hiçbir metin yazma.
- "legal_category" yalnızca şu değerlerden biri olmalı: {LEGAL_CATEGORIES}
- "risk_level" yalnızca: "low" | "medium" | "high"
- "actors" ve "recommended_process" liste olmalı.
- "timeline" bir liste; her eleman {{ "date": string|null, "event": string }}.
- Belirsizlik varsa en olası varsayımı yap ama abartma; gerekirse "extracted_entities" içine "unknown" alanlar ekle.
""".strip()


def build_user_prompt(case_text: str, retrieval_context: str | None) -> str:
    context_block = ""
    if retrieval_context:
        context_block = f"\n\nİlgili doküman parçaları (referans):\n{retrieval_context}\n"
    return f"""
Kullanıcı anlatımı:
{case_text}
{context_block}

İstenen çıktı şeması (JSON):
{{
  "legal_category": "Kira Hukuku",
  "actors": ["Kiracı", "Ev Sahibi"],
  "claim": "Depozito İadesi",
  "recommended_process": ["Yazılı talep gönder", "Arabuluculuk başvurusu", "Dava aç"],
  "risk_level": "medium",
  "extracted_entities": {{}},
  "timeline": [{{"date": null, "event": "..."}}]
}}

Yalnızca JSON döndür.
""".strip()

