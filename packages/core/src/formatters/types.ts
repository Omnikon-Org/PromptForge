import type { PromptState } from '../builder';

export interface PromptFormatter {
  format(state: PromptState): string;
}
