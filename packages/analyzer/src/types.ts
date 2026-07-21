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
  diagnostics?: Diagnostic[];
}

export interface PromptAnalyzer {
  analyze(promptText: string): Promise<AnalysisReport>;
}

export interface Diagnostic {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
}

export interface BenchmarkResult {
  name: string;
  ranking: number;
  tokens: number;
  latencyEstimateMs: number;
  costEstimateUsd: number;
  complexityScore: number;
  readabilityScore: number;
}
