import { ModelRegistry } from '../registry/ModelRegistry';

export interface CostEstimate {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
}

export function estimateCost(options: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}): CostEstimate {
  const info = ModelRegistry.getModelInfo(options.model);

  if (!info || !info.pricing) {
    return {
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
      currency: 'USD',
    };
  }

  const inputCost = (options.inputTokens / 1000) * info.pricing.inputPer1k;
  const outputCost = (options.outputTokens / 1000) * info.pricing.outputPer1k;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    currency: info.pricing.currency || 'USD',
  };
}
