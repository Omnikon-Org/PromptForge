import type { PromptFormatter } from './types';
import type { PromptState } from '../builder';

export class XMLFormatter implements PromptFormatter {
  public format(state: PromptState): string {
    const sections: string[] = [];

    if (state.role) {
      sections.push(`<role>\n${state.role}\n</role>`);
    }

    if (state.task) {
      sections.push(`<task>\n${state.task}\n</task>`);
    }

    if (state.contexts && state.contexts.length > 0) {
      const contextsStr = state.contexts.map((c) => `<item>${c}</item>`).join('\n');
      sections.push(`<context>\n${contextsStr}\n</context>`);
    }

    if (state.constraints && state.constraints.length > 0) {
      const constraintsStr = state.constraints.map((c) => `<item>${c}</item>`).join('\n');
      sections.push(`<constraints>\n${constraintsStr}\n</constraints>`);
    }

    const guidelines: string[] = [];
    if (state.output) guidelines.push(`<format>${state.output}</format>`);
    if (state.language) guidelines.push(`<language>${state.language}</language>`);
    if (state.tone) guidelines.push(`<tone>${state.tone}</tone>`);
    if (state.audience) guidelines.push(`<audience>${state.audience}</audience>`);

    if (guidelines.length > 0) {
      sections.push(`<guidelines>\n${guidelines.join('\n')}\n</guidelines>`);
    }

    if (state.examples && state.examples.length > 0) {
      const examplesStr = state.examples
        .map(
          (ex) =>
            `<example>\n<input>\n${ex.input}\n</input>\n<output>\n${ex.output}\n</output>\n</example>`,
        )
        .join('\n');
      sections.push(`<examples>\n${examplesStr}\n</examples>`);
    }

    if (state.memory) {
      sections.push(`<memory>\n${state.memory}\n</memory>`);
    }

    return `<prompt>\n${sections.join('\n\n')}\n</prompt>`;
  }
}
