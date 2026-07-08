export type QuestionType = "single" | "multiple" | "tf" | "sort" | "matching";

export interface SubQuestion {
  text: string;
  answer: string; // "是" or "否" or other strings
}

export interface Question {
  id: number;
  category: "生成式人工智慧方法與方法論" | "基礎提示工程 (Prompt Engineering)" | "提示優化 (Prompt Refinement)" | "倫理、法律與社會影響";
  type: QuestionType;
  text: string;
  options?: string[]; // For single, multiple
  items?: string[]; // For sort
  leftItems?: string[]; // For matching
  rightItems?: string[]; // For matching
  subQuestions?: SubQuestion[]; // For tf
  answer: number | number[] | { [key: number]: string } | { [key: number]: number }; // Matching can be indices
  explanation: string;
  source?: "A" | "B";
}

export type ExamMode = "study" | "exam";
export type ExamRange = "A" | "B" | "ALL";

export interface CategoryStat {
  correct: number;
  total: number;
}

export interface ExamReport {
  score: number;
  correctCount: number;
  totalCount: number;
  timeSpentSeconds: number;
  categories: {
    [categoryName: string]: CategoryStat;
  };
}
