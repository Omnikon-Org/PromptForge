import type { ValidationRule, ValidationIssue } from '../types';
import type { PromptState } from '../../builder';

export class RequireOutputFormatRule implements ValidationRule {
  name = 'RequireOutputFormatRule';
  validate(state: PromptState): ValidationIssue | null {
    if (!state.output || state.output.trim() === '') {
      return {
        rule: this.name,
        message: 'It is highly recommended to specify an output format.',
        severity: 'warning',
      };
    }
    return null;
  }
}
