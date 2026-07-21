import { ModelRegistry } from '../registry/ModelRegistry';

export async function estimateTokens(prompt: string, options: { model: string }): Promise<number> {
  const modelInfo = ModelRegistry.getModelInfo(options.model);

  if (!modelInfo) {
    // Graceful fallback if model is unknown
    const fallback = await import('./fallback');
    return fallback.countTokens(prompt);
  }

  const tokenizer = await modelInfo.tokenizer();
  return tokenizer(prompt);
}
