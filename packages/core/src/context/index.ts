import { ModelRegistry } from '../registry/ModelRegistry';
import { estimateTokens } from '../tokenizers';

export interface ContextCheckResult {
  fits: boolean;
  remainingTokens: number;
  maxContext: number;
  usedTokens: number;
}

export async function checkContext(options: {
  model: string;
  prompt: string;
}): Promise<ContextCheckResult> {
  const info = ModelRegistry.getModelInfo(options.model);
  const maxContext = info?.maxContext || 8192; // Default fallback context

  const usedTokens = await estimateTokens(options.prompt, { model: options.model });
  const remainingTokens = maxContext - usedTokens;

  return {
    fits: remainingTokens >= 0,
    remainingTokens,
    maxContext,
    usedTokens,
  };
}
