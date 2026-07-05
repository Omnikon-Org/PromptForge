export * from './types';
export * from './HeuristicAnalyzer';

import { HeuristicAnalyzer } from './HeuristicAnalyzer';

/**
 * Analyzes a prompt string and returns a structured diagnostic report.
 *
 * Note: This currently uses a heuristic-based engine, but is
 * designed to be seamlessly swapped with an LLM engine in the future
 * without breaking the API contract.
 */
export const analyzePrompt = async (promptText: string) => {
  const analyzer = new HeuristicAnalyzer();
  return analyzer.analyze(promptText);
};
