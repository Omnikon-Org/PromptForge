import type { Prompt } from '@promptforgee/core';

export interface PromptOptimizer {
  optimize(prompt: Prompt): Promise<Prompt>;
}
