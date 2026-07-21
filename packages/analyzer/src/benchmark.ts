import { BenchmarkResult } from './types';

export interface PromptVariation {
  name: string;
  prompt: string;
}

export function benchmark(variations: PromptVariation[]): BenchmarkResult[] {
  const results = variations.map((v) => {
    // Basic heuristic simulation for offline benchmarking
    const chars = v.prompt.length;
    const tokens = Math.ceil(chars / 4);

    // Assume ~20ms latency per 1000 input tokens just for comparison baseline
    const latencyEstimateMs = Math.round((tokens / 1000) * 20);

    // Assume average GPT-4o input pricing $5 per 1M tokens ($0.005 per 1k)
    const costEstimateUsd = (tokens / 1000) * 0.005;

    const words = v.prompt.split(/\s+/).filter((w) => w.length > 0).length;
    const sentences = v.prompt.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    const readabilityScore = sentences > 0 ? Math.min(100, Math.round((words / sentences) * 4)) : 0;
    const complexityScore = Math.min(100, Math.round((tokens / 100) * 5));

    return {
      name: v.name,
      tokens,
      latencyEstimateMs,
      costEstimateUsd,
      complexityScore,
      readabilityScore,
      ranking: 0, // Will be set after sorting
    };
  });

  // Sort by lowest cost/tokens as best ranking
  results.sort((a, b) => a.tokens - b.tokens);

  results.forEach((r, index) => {
    r.ranking = index + 1;
  });

  return results;
}
