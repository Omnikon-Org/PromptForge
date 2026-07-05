import type { ValidationRule, ValidationIssue } from '../types';
import type { PromptState } from '../../builder';

export class NoDuplicateContextRule implements ValidationRule {
  name = 'NoDuplicateContextRule';
  validate(state: PromptState): ValidationIssue | null {
    const unique = new Set(state.contexts);
    if (unique.size !== state.contexts.length) {
      return {
        rule: this.name,
        message: 'Duplicate context sections detected.',
        severity: 'warning',
      };
    }
    return null;
  }
}
