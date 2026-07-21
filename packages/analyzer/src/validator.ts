import { Diagnostic } from './types';

export function validatePrompt(prompt: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  // Match all instances of {{variable}}
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const matches = [...prompt.matchAll(placeholderRegex)];

  const seenPlaceholders = new Set<string>();

  for (const match of matches) {
    const raw = match[0];
    const variable = match[1].trim();

    if (variable === '') {
      diagnostics.push({
        severity: 'error',
        code: 'PF002',
        message: 'Empty placeholder found: {{}}',
      });
      continue;
    }

    if (seenPlaceholders.has(variable)) {
      diagnostics.push({
        severity: 'warning',
        code: 'PF001',
        message: `Duplicate placeholder found: {{${variable}}}`,
      });
    } else {
      seenPlaceholders.add(variable);
    }

    // Check for nested or malformed placeholders like {{ var {{ nested }} }}
    if (variable.includes('{{') || variable.includes('}}')) {
      diagnostics.push({
        severity: 'error',
        code: 'PF003',
        message: `Malformed or nested placeholder syntax: ${raw}`,
      });
    }
  }

  // Check for excessively large raw strings (heuristic)
  if (prompt.length > 50000) {
    diagnostics.push({
      severity: 'warning',
      code: 'PF004',
      message: 'Prompt exceeds recommended length (approx 50k chars). Consider splitting it.',
    });
  }

  return diagnostics;
}
