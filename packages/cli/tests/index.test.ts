import { describe, it, expect } from 'vitest';
import { program } from '../src/index';

describe('PromptForge CLI', () => {
  it('should have basic metadata', () => {
    expect(program.name()).toBe('promptforge');
    expect(program.version()).toBe('0.1.0');
  });

  it('should register all core commands', () => {
    const cmds = program.commands.map((c) => c.name());
    expect(cmds).toContain('init');
    expect(cmds).toContain('analyze');
    expect(cmds).toContain('optimize');
    expect(cmds).toContain('doctor');
    expect(cmds).toContain('template');
    expect(cmds).toContain('generate');
  });
});
