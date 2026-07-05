export interface AnalysisReport {
  overallScore: number; // 0-100
  readability: string; // e.g., 'Easy', 'Moderate', 'Complex'
  clarity: number; // 0-100
  ambiguity: number; // 0-100
  estimatedTokenCount: number;
  suggestions: string[];
  missingInformation: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface PromptAnalyzer {
  analyze(promptText: string): Promise<AnalysisReport>;
}
