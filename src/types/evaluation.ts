export interface Reference {
  file_name: string;
  page_number: number;
}

export interface ReasonForChange {
  reason: string;
  supporting_text: string;
  reference: Reference;
}

export interface EvaluationData {
  name: string;
  latest_yoy_pct: number;
  reasons_for_change: ReasonForChange[];
}

export interface EvaluationQuestion {
  id: string;
  type: 'rating' | 'yes_no' | 'text' | 'custom';
  label: string;
  required: boolean;
  options?: string[] | number[];
  minLabel?: string;
  maxLabel?: string;
}

export interface EvaluationResponse {
  questionId: string;
  value: string | number | boolean;
}

export interface DatasetFieldConfig {
  field: string;
  label: string;
  included: boolean;
}

export interface SubmittedEvaluation {
  id: string;
  name: string;
  data: EvaluationData[];
  questions: EvaluationQuestion[];
  responses: Record<string, EvaluationResponse[]>;
  fieldConfig: DatasetFieldConfig[];
  instructions: string;
  submittedAt: string;
  status: 'completed' | 'in_progress';
}

// Evaluation template created by data scientists
export interface EvaluationTemplate {
  id: string;
  name: string;
  description?: string;
  data: EvaluationData[];
  sampleData?: EvaluationData[];
  questions: EvaluationQuestion[];
  fieldConfig: DatasetFieldConfig[];
  instructions: string;
  createdAt: string;
  status: 'draft' | 'published';
}
