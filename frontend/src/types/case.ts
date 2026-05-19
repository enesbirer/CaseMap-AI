export type RiskLevel = "low" | "medium" | "high";

export type TimelineEvent = { date: string | null; event: string };

export type CaseAnalyzeResponse = {
  case_id: string;
  legal_category: string;
  actors: string[];
  claim: string;
  recommended_process: string[];
  risk_level: RiskLevel;
  extracted_entities: Record<string, unknown>;
  timeline: TimelineEvent[];
  llm_provider: string;
  llm_model: string;
  created_at: string;
};

export type CaseAnalyzeRequest = {
  text: string;
  provider?: "ollama" | "openai";
  model?: string;
  retrieval?: boolean;
};

