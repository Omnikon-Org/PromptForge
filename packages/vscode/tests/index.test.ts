import { describe, it, expect } from 'vitest';
import { hello } from '../src/index';

describe('@promptforgee/vscode', () => {
  it('should say hello', () => {
    expect(hello()).toBe('Hello from @promptforgee/vscode');
  });
});
