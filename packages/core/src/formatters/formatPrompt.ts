export function formatPrompt(prompt: string): string {
  // A Prettier-like formatter for prompts
  let formatted = prompt;

  // 1. Normalize line endings to \n
  formatted = formatted.replace(/\r\n/g, '\n');

  // 2. Remove trailing spaces on each line
  formatted = formatted.replace(/[ \t]+$/gm, '');

  // 3. Compress multiple blank lines down to a maximum of one blank line
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // 4. Ensure the file ends with exactly one newline
  formatted = formatted.trimEnd() + '\n';

  return formatted;
}
