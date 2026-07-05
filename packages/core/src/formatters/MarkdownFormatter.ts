import type { PromptFormatter } from './types';
import type { PromptState } from '../builder';

export class MarkdownFormatter implements PromptFormatter {
  public format(state: PromptState): string {
    const sections: string[] = [];

    if (state.role) {
      sections.push(`## ROLE\n${state.role}`);
    }

    if (state.task) {
      sections.push(`## TASK\n${state.task}`);
    }

    if (state.contexts && state.contexts.length > 0) {
      const contextsStr = state.contexts.map((c) => `- ${c}`).join('\n');
      sections.push(`## CONTEXT\n${contextsStr}`);
    }

    if (state.constraints && state.constraints.length > 0) {
      const constraintsStr = state.constraints.map((c) => `- ${c}`).join('\n');
      sections.push(`## CONSTRAINTS\n${constraintsStr}`);
    }

    const guidelines: string[] = [];
    if (state.output) guidelines.push(`Format: ${state.output}`);
    if (state.language) guidelines.push(`Language: ${state.language}`);
    if (state.tone) guidelines.push(`Tone: ${state.tone}`);
    if (state.audience) guidelines.push(`Audience: ${state.audience}`);

    if (guidelines.length > 0) {
      sections.push(`## GUIDELINES\n${guidelines.map((g) => `- ${g}`).join('\n')}`);
    }

    if (state.examples && state.examples.length > 0) {
      const examplesStr = state.examples
        .map(
          (ex, i) => `### Example ${i + 1}\n**Input:**\n${ex.input}\n\n**Output:**\n${ex.output}`,
        )
        .join('\n\n');
      sections.push(`## EXAMPLES\n${examplesStr}`);
    }

    if (state.memory) {
      sections.push(`## MEMORY / HISTORY\n${state.memory}`);
    }

    return sections.join('\n\n');
  }
}
