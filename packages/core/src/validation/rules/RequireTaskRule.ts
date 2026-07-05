import type { ValidationRule, ValidationIssue } from '../types';
import type { PromptState } from '../../builder';

export class RequireTaskRule implements ValidationRule {
  name = 'RequireTaskRule';
  validate(state: PromptState): ValidationIssue | null {
    if (!state.task || state.task.trim() === '') {
      return {
        rule: this.name,
        message: 'A prompt should have a primary task or objective defined.',
        severity: 'error',
      };
    }
    return null;
  }
}
