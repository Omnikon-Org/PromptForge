import { describe, it, expect } from 'vitest';
import { Prompt } from '@promptforgee/core';
import { optimizePrompt } from '../src/index';

describe('Prompt Optimizer', () => {
  it('should strip filler words from role and task', async () => {
    const original = Prompt.create()
      .role('Please act as a developer')
      .task('Could you write some code?');

    const optimized = await optimizePrompt(original);
    const state = optimized.getState();

    expect(state.role).not.toMatch(/please/i);
    expect(state.task).not.toMatch(/could you/i);
    expect(state.role).toBe('Act as a developer');
    expect(state.task).toBe('Write some code?');
  });

  it('should deduplicate contexts and constraints', async () => {
    const original = Prompt.create()
      .context('Dupe data')
      .context('Dupe data')
      .constraint('Dupe rule')
      .constraint('Dupe rule');

    const optimized = await optimizePrompt(original);
    const state = optimized.getState();

    expect(state.contexts.length).toBe(1);
    expect(state.constraints.length).toBe(1);
  });

  it('should strengthen constraints without prefixing existing strong ones', async () => {
    const original = Prompt.create()
      .constraint('Write clean code')
      .constraint('NEVER use var')
      .constraint('CRITICAL: Do not fail');

    const optimized = await optimizePrompt(original);
    const state = optimized.getState();

    expect(state.constraints[0]).toMatch(/^MUST: /);
    expect(state.constraints[1]).toBe('NEVER use var'); // Preserved
    expect(state.constraints[2]).toBe('CRITICAL: Do not fail'); // Preserved
  });
});
