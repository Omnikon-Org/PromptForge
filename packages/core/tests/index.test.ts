import { describe, it, expect } from 'vitest';
import { Prompt } from '../src/index';

describe('PromptBuilder', () => {
  it('should initialize with an empty state', () => {
    const prompt = Prompt.create();
    expect(prompt.build()).toBe('');
  });

  it('should correctly build a full prompt', () => {
    const prompt = Prompt.create()
      .role('Senior Software Engineer')
      .task('Write a TypeScript function')
      .context('We are using Node.js 18')
      .context('We prefer functional programming')
      .constraint('No any types allowed')
      .constraint('No external dependencies')
      .output('Markdown code block')
      .language('English')
      .tone('Professional')
      .audience('Junior Developers')
      .example('Input: a, b', 'Output: a + b')
      .memory('User previously asked for python code, but we switched to TS.');

    const result = prompt.build();

    expect(result).toContain('## ROLE\nSenior Software Engineer');
    expect(result).toContain('## TASK\nWrite a TypeScript function');
    expect(result).toContain(
      '## CONTEXT\n- We are using Node.js 18\n- We prefer functional programming',
    );
    expect(result).toContain('## CONSTRAINTS\n- No any types allowed\n- No external dependencies');
    expect(result).toContain(
      '## GUIDELINES\n- Format: Markdown code block\n- Language: English\n- Tone: Professional\n- Audience: Junior Developers',
    );
    expect(result).toContain(
      '## EXAMPLES\n### Example 1\n**Input:**\nInput: a, b\n\n**Output:**\nOutput: a + b',
    );
    expect(result).toContain(
      '## MEMORY / HISTORY\nUser previously asked for python code, but we switched to TS.',
    );
  });

  it('should be immutable', () => {
    const base = Prompt.create().role('Base Role');
    const branch1 = base.task('Task 1');
    const branch2 = base.task('Task 2');

    expect(base.build()).toContain('Base Role');
    expect(base.build()).not.toContain('Task 1');

    expect(branch1.build()).toContain('Task 1');
    expect(branch1.build()).not.toContain('Task 2');

    expect(branch2.build()).toContain('Task 2');
    expect(branch2.build()).not.toContain('Task 1');
  });

  it('should safely omit unused sections', () => {
    const prompt = Prompt.create().task('Only task');

    const result = prompt.build();

    expect(result).toBe('## TASK\nOnly task');
    expect(result).not.toContain('ROLE');
    expect(result).not.toContain('CONTEXT');
  });
});
