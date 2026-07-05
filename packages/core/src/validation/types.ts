import type { PromptState } from '../builder';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  rule: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface ValidationRule {
  name: string;
  validate(state: PromptState): ValidationIssue | null | ValidationIssue[];
}
