import { describe, it, expect } from 'vitest';
import { hello } from '../src/index';

describe('@promptforgee/schema', () => {
  it('should say hello', () => {
    expect(hello()).toBe('Hello from @promptforgee/schema');
  });
});
