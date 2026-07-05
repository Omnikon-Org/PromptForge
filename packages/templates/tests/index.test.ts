import { describe, it, expect } from 'vitest';
import {
  FrontendEngineer,
  BackendEngineer,
  ReactExpert,
  CodeReviewer,
  Teacher,
  Interviewer,
  Debugger,
  SecurityEngineer,
  Researcher,
  Translator,
  TechnicalWriter,
} from '../src/index';

describe('@promptforgee/templates', () => {
  it('should export valid Prompt instances', () => {
    const templates = [
      FrontendEngineer,
      BackendEngineer,
      ReactExpert,
      CodeReviewer,
      Teacher,
      Interviewer,
      Debugger,
      SecurityEngineer,
      Researcher,
      Translator,
      TechnicalWriter,
    ];

    for (const t of templates) {
      expect(typeof t.build).toBe('function');
      const output = t.build();
      expect(output).toContain('## ROLE');
    }
  });

  it('should be safely composable and immutable', () => {
    // Branching off a template should not mutate it
    const customized = ReactExpert.task('Review this PR');

    expect(ReactExpert.build()).not.toContain('Review this PR');
    expect(customized.build()).toContain('Review this PR');
    expect(customized.build()).toContain('Senior React Architect'); // Inherited from base
  });
});
