import type { ValidationRule, ValidationIssue } from '../types';
import type { PromptState } from '../../builder';

export class MaxLengthRule implements ValidationRule {
  name = 'MaxLengthRule';
  private maxChars: number;

  constructor(maxChars: number = 50000) {
    this.maxChars = maxChars;
  }

  validate(state: PromptState): ValidationIssue | null {
    let totalLength = 0;
    if (state.role) totalLength += state.role.length;
    if (state.task) totalLength += state.task.length;
    state.contexts.forEach((c) => (totalLength += c.length));
    state.constraints.forEach((c) => (totalLength += c.length));
    state.examples.forEach((e) => (totalLength += e.input.length + e.output.length));
    if (state.memory) totalLength += state.memory.length;

    if (totalLength > this.maxChars) {
      return {
        rule: this.name,
        message: `Prompt content exceeds recommended length of ${this.maxChars} characters.`,
        severity: 'warning',
      };
    }
    return null;
  }
}
