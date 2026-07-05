export * from './types';
export * from './HeuristicOptimizer';

import { HeuristicOptimizer } from './HeuristicOptimizer';
import type { Prompt } from '@promptforgee/core';

/**
 * Takes a PromptBuilder instance and returns a highly optimized equivalent Prompt.
 * Drops filler words, deduplicates contexts, and strengthens constraints.
 */
export const optimizePrompt = async (prompt: Prompt): Promise<Prompt> => {
  const optimizer = new HeuristicOptimizer();
  return optimizer.optimize(prompt);
};
