import { describe, it, expect } from 'vitest';
import { Prompt } from '../src/builder';
import { PromptValidator } from '../src/validation/Validator';

describe('Prompt Validation', () => {
  it('should invalidate empty prompts', () => {
    const prompt = Prompt.create();
    const result = prompt.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.rule === 'RequireTaskRule')).toBe(true);
  });

  it('should flag duplicate contexts', () => {
    const prompt = Prompt.create()
      .task('Valid task')
      .context('Duplicate context')
      .context('Duplicate context');

    const result = prompt.validate();

    expect(result.warnings.some((w) => w.rule === 'NoDuplicateContextRule')).toBe(true);
  });

  it('should catch empty roles explicitly set', () => {
    const prompt = Prompt.create().role('   ').task('Valid task');

    const result = prompt.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.rule === 'NonEmptyRoleRule')).toBe(true);
  });

  it('should validate perfect prompts successfully', () => {
    const prompt = Prompt.create().role('Assistant').task('Do work').output('JSON');

    const result = prompt.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0); // Because output format is provided
  });

  it('should allow custom rules', () => {
    const customValidator = new PromptValidator();
    customValidator.addRule({
      name: 'CustomRule',
      validate: (state) => {
        if (!state.tone) {
          return { rule: 'CustomRule', message: 'Tone needed', severity: 'error' };
        }
        return null;
      },
    });

    const prompt = Prompt.create().task('Task');
    const result = prompt.validate(customValidator);

    // Default rules still apply because new PromptValidator(true) is default
    // We added CustomRule, so it should flag tone
    expect(result.errors.some((e) => e.rule === 'CustomRule')).toBe(true);
  });
});
