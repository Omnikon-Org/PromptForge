import type { ValidationRule, ValidationIssue } from '../types';
import type { PromptState } from '../../builder';

export class NonEmptyRoleRule implements ValidationRule {
  name = 'NonEmptyRoleRule';
  validate(state: PromptState): ValidationIssue | null {
    if (state.role !== undefined && state.role.trim() === '') {
      return {
        rule: this.name,
        message: 'Role was set but is empty.',
        severity: 'error',
      };
    }
    return null;
  }
}
