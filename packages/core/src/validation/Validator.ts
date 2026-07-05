import type { PromptState } from '../builder';
import type { ValidationRule, ValidationResult, ValidationIssue } from './types';
import {
  RequireTaskRule,
  RequireOutputFormatRule,
  NoDuplicateConstraintsRule,
  NoDuplicateContextRule,
  NonEmptyRoleRule,
  MaxLengthRule,
} from './rules';

export class PromptValidator {
  private rules: ValidationRule[] = [];

  constructor(useDefaultRules: boolean = true) {
    if (useDefaultRules) {
      this.addRule(new RequireTaskRule());
      this.addRule(new RequireOutputFormatRule());
      this.addRule(new NoDuplicateConstraintsRule());
      this.addRule(new NoDuplicateContextRule());
      this.addRule(new NonEmptyRoleRule());
      this.addRule(new MaxLengthRule());
    }
  }

  public addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  public validate(state: PromptState): ValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(state);
      if (result) {
        const issues = Array.isArray(result) ? result : [result];
        for (const issue of issues) {
          if (issue.severity === 'error') {
            errors.push(issue);
          } else {
            warnings.push(issue);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
