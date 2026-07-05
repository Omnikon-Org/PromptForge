import { describe, it, expect } from 'vitest';
import { analyzePrompt } from '../src/index';

describe('Prompt Analyzer', () => {
  it('should analyze a terrible prompt', async () => {
    const terriblePrompt = 'stuff things somehow good bad maybe';
    const report = await analyzePrompt(terriblePrompt);

    expect(report.ambiguity).toBeGreaterThan(50);
    expect(report.missingInformation).toContain('Persona/Role definition');
    expect(report.missingInformation).toContain('Explicit task definition');
    expect(report.overallScore).toBeLessThan(80);
    expect(report.weaknesses).toContain('Contains vague or ambiguous language ("stuff", "maybe").');
  });

  it('should highly rate a structured prompt', async () => {
    const excellentPrompt = `
      ## ROLE
      You are an expert system.

      ## TASK
      Generate a JSON response based on the input data.

      ## CONTEXT
      Data: 1, 2, 3.

      ## GUIDELINES
      Format: JSON

      ## EXAMPLES
      <example>
      Input: 1
      Output: {"value": 1}
      </example>
    `;
    const report = await analyzePrompt(excellentPrompt);

    expect(report.ambiguity).toBeLessThan(30);
    expect(report.strengths).toContain('Defines a clear persona/role.');
    expect(report.strengths).toContain('Explicit task isolation.');
    expect(report.strengths).toContain('Uses few-shot examples.');
    expect(report.overallScore).toBeGreaterThan(80);
    expect(report.missingInformation.length).toBe(0);
  });

  it('should handle empty prompts', async () => {
    const report = await analyzePrompt('');
    expect(report.overallScore).toBe(0);
    expect(report.missingInformation).toContain('Everything');
    expect(report.ambiguity).toBe(100);
  });
});
