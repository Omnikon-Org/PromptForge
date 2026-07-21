export interface ModelPricing {
  inputPer1k: number;
  outputPer1k: number;
  currency?: string;
}

export interface ModelInfo {
  name: string;
  provider: string;
  family: string;
  maxContext: number;
  pricing?: ModelPricing;
  tokenizer: () => Promise<(text: string) => number>;
}

class Registry {
  private models: Map<string, ModelInfo> = new Map();

  registerModel(info: ModelInfo) {
    this.models.set(info.name, info);
  }

  getModelInfo(name: string): ModelInfo | undefined {
    return this.models.get(name);
  }

  getAllModels(): ModelInfo[] {
    return Array.from(this.models.values());
  }
}

export const ModelRegistry = new Registry();

// Register default models
ModelRegistry.registerModel({
  name: 'gpt-4o',
  provider: 'openai',
  family: 'gpt',
  maxContext: 128000,
  pricing: { inputPer1k: 0.005, outputPer1k: 0.015, currency: 'USD' },
  tokenizer: () => import('../tokenizers/gpt').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'gpt-4-turbo',
  provider: 'openai',
  family: 'gpt',
  maxContext: 128000,
  pricing: { inputPer1k: 0.01, outputPer1k: 0.03, currency: 'USD' },
  tokenizer: () => import('../tokenizers/gpt').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'claude-3-opus-20240229',
  provider: 'anthropic',
  family: 'claude',
  maxContext: 200000,
  pricing: { inputPer1k: 0.015, outputPer1k: 0.075, currency: 'USD' },
  tokenizer: () => import('../tokenizers/claude').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'claude-3-sonnet-20240229',
  provider: 'anthropic',
  family: 'claude',
  maxContext: 200000,
  pricing: { inputPer1k: 0.003, outputPer1k: 0.015, currency: 'USD' },
  tokenizer: () => import('../tokenizers/claude').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'gemini-1.5-pro',
  provider: 'google',
  family: 'gemini',
  maxContext: 1048576, // 1M tokens, sometimes 2M
  pricing: { inputPer1k: 0.007, outputPer1k: 0.021, currency: 'USD' },
  tokenizer: () => import('../tokenizers/gemini').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'gemini-1.5-flash',
  provider: 'google',
  family: 'gemini',
  maxContext: 1048576,
  pricing: { inputPer1k: 0.00075, outputPer1k: 0.003, currency: 'USD' },
  tokenizer: () => import('../tokenizers/gemini').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'llama-3-70b',
  provider: 'meta',
  family: 'llama',
  maxContext: 8192,
  pricing: { inputPer1k: 0.0007, outputPer1k: 0.0009, currency: 'USD' },
  tokenizer: () => import('../tokenizers/llama').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'deepseek-coder',
  provider: 'deepseek',
  family: 'deepseek',
  maxContext: 32000,
  pricing: { inputPer1k: 0.00014, outputPer1k: 0.00028, currency: 'USD' },
  tokenizer: () => import('../tokenizers/fallback').then((m) => m.countTokens),
});

ModelRegistry.registerModel({
  name: 'mistral-large-latest',
  provider: 'mistral',
  family: 'mistral',
  maxContext: 32000,
  pricing: { inputPer1k: 0.004, outputPer1k: 0.012, currency: 'USD' },
  tokenizer: () => import('../tokenizers/fallback').then((m) => m.countTokens),
});
