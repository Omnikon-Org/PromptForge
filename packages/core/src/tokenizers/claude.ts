export const countTokens = (text: string): number => {
  // Claude typically uses slightly more tokens per word than GPT
  return Math.ceil(text.length / 3.5);
};
