import { describe, it, expect } from 'vitest';
import { hello } from '../src/index';

describe('@promptforgee/react', () => {
  it('should say hello', () => {
    expect(hello()).toBe('Hello from @promptforgee/react');
  });
});
