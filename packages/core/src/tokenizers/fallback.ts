export const countTokens = (text: string): number => {
  // Generic fallback: ~4 characters per token
  return Math.ceil(text.length / 4);
};
