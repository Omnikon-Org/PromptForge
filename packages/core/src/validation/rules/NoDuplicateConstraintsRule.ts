import type { ValidationRule, ValidationIssue } from '../types';
import type { PromptState } from '../../builder';

export class NoDuplicateConstraintsRule implements ValidationRule {
  name = 'NoDuplicateConstraintsRule';
  validate(state: PromptState): ValidationIssue | null {
    const unique = new Set(state.constraints);
    if (unique.size !== state.constraints.length) {
      return {
        rule: this.name,
        message: 'Duplicate constraints detected.',
        severity: 'warning',
      };
    }
    return null;
  }
}
