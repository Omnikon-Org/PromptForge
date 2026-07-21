export const countTokens = (text: string): number => {
  // Gemini token estimation
  return Math.ceil(text.length / 4);
};
