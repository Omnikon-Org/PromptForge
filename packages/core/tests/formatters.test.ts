import { describe, it, expect } from 'vitest';
import { Prompt } from '../src/builder';
import { XMLFormatter } from '../src/formatters/XMLFormatter';
import { MarkdownFormatter } from '../src/formatters/MarkdownFormatter';

describe('Formatters', () => {
  describe('MarkdownFormatter (Default)', () => {
    it('should format empty state correctly', () => {
      const prompt = Prompt.create();
      expect(prompt.build()).toBe('');
      expect(prompt.build(new MarkdownFormatter())).toBe('');
    });

    it('should skip empty arrays and strings gracefully', () => {
      const prompt = Prompt.create().task('Test task');
      const result = prompt.build();
      expect(result).toBe('## TASK\nTest task');
      expect(result).not.toContain('CONTEXT');
    });
  });

  describe('XMLFormatter', () => {
    it('should format empty state correctly', () => {
      const prompt = Prompt.create();
      expect(prompt.build(new XMLFormatter())).toBe('<prompt>\n\n</prompt>');
    });

    it('should wrap elements in XML tags', () => {
      const prompt = Prompt.create().role('Assistant').context('Data: {}').output('JSON');

      const result = prompt.build(new XMLFormatter());

      expect(result).toContain('<role>\nAssistant\n</role>');
      expect(result).toContain('<context>\n<item>Data: {}</item>\n</context>');
      expect(result).toContain('<guidelines>\n<format>JSON</format>\n</guidelines>');
      expect(result).not.toContain('<task>');
    });

    it('should format examples cleanly', () => {
      const prompt = Prompt.create().example('Hello', 'World');

      const result = prompt.build(new XMLFormatter());
      expect(result).toContain(
        '<examples>\n<example>\n<input>\nHello\n</input>\n<output>\nWorld\n</output>\n</example>\n</examples>',
      );
    });
  });
});
