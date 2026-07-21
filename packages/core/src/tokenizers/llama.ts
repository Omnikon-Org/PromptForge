export const countTokens = (text: string): number => {
  // LLaMA token estimation
  return Math.ceil(text.length / 3.8);
};
