import { estimateTokens } from '../tokenizers';
import { estimateCost, CostEstimate } from '../cost';
import { checkContext, ContextCheckResult } from '../context';

export interface Diagnostic {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
}

export interface InspectionReport {
  tokens: number;
  cost: CostEstimate;
  context: ContextCheckResult;
  diagnostics: Diagnostic[];
  variables: string[];
  readability: number;
  complexity: number;
}

export async function inspectPrompt(
  promptText: string,
  options: { model?: string } = {},
): Promise<InspectionReport> {
  const model = options.model || 'gpt-4o'; // Default model

  // Await token counting and context checks
  const tokens = await estimateTokens(promptText, { model });
  const context = await checkContext({ model, prompt: promptText });
  const cost = estimateCost({ model, inputTokens: tokens, outputTokens: 0 }); // Assuming output is estimated later or 0 for now

  // Extract variables (assuming mustache syntax {{var}})
  const variablesMatch = promptText.match(/\{\{([^}]+)\}\}/g) || [];
  const variables = [...new Set(variablesMatch.map((v) => v.replace(/[{}]/g, '').trim()))];

  // Basic Diagnostics
  const diagnostics: Diagnostic[] = [];

  if (context.remainingTokens < 0) {
    diagnostics.push({
      severity: 'error',
      code: 'PF002',
      message: 'Prompt exceeds maximum context window.',
    });
  }

  // Very basic heuristic for readability/complexity
  const wordCount = promptText.split(/\s+/).filter((w) => w.length > 0).length;
  const sentenceCount = promptText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  const readability =
    sentenceCount > 0 ? Math.min(100, Math.round((wordCount / sentenceCount) * 4)) : 0;
  const complexity = Math.min(100, Math.round((tokens / 100) * 5));

  return {
    tokens,
    cost,
    context,
    diagnostics,
    variables,
    readability,
    complexity,
  };
}
