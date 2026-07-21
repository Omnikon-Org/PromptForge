export const countTokens = (text: string): number => {
  // Rough heuristic for GPT tokens (approx 4 chars per token)
  // In a real production environment, this could lazily load tiktoken
  return Math.ceil(text.length / 4);
};
