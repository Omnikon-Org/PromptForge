import { describe, it, expect, beforeEach } from 'vitest';
import { Prompt } from '@promptforgee/core';
import { PromptRegistry } from '../src/index';

describe('Prompt Registry', () => {
  let registry: PromptRegistry;

  beforeEach(() => {
    registry = new PromptRegistry();
  });

  it('should auto-increment versions on identical names', async () => {
    const prompt1 = Prompt.create().task('Version 1');
    const prompt2 = Prompt.create().task('Version 2');

    const v1 = await registry.save('MyTask', prompt1);
    const v2 = await registry.save('MyTask', prompt2);

    expect(v1.version).toBe(1);
    expect(v2.version).toBe(2);
  });

  it('should retrieve the latest version by default', async () => {
    await registry.save('TestPrompt', Prompt.create().task('v1'));
    await registry.save('TestPrompt', Prompt.create().task('v2'));

    const loaded = await registry.load('TestPrompt');
    expect(loaded?.getState().task).toBe('v2');
  });

  it('should retrieve a specific version if requested', async () => {
    await registry.save('TestPrompt', Prompt.create().task('v1'));
    await registry.save('TestPrompt', Prompt.create().task('v2'));

    const loaded = await registry.load('TestPrompt', 1);
    expect(loaded?.getState().task).toBe('v1');
  });

  it('should search by tags', async () => {
    await registry.save('Test1', Prompt.create(), ['frontend', 'react']);
    await registry.save('Test2', Prompt.create(), ['backend', 'node']);
    await registry.save('Test3', Prompt.create(), ['frontend', 'vue']);

    const results = await registry.search({ tags: ['frontend'] });
    expect(results.length).toBe(2);
    expect(results.map((r) => r.name)).toContain('Test1');
    expect(results.map((r) => r.name)).toContain('Test3');
  });

  it('should export and import JSON accurately', async () => {
    await registry.save('ExportMe', Prompt.create().task('Do it'), ['test']);

    const json = await registry.exportToJSON();
    expect(json).toContain('ExportMe');

    const newRegistry = new PromptRegistry();
    await newRegistry.importFromJSON(json);

    const loaded = await newRegistry.load('ExportMe');
    expect(loaded).toBeDefined();
    expect(loaded?.getState().task).toBe('Do it');
  });
});
