import { Prompt } from '@promptforgee/core';
import type { PromptOptimizer } from './types';

export class HeuristicOptimizer implements PromptOptimizer {
  public async optimize(prompt: Prompt): Promise<Prompt> {
    const state = prompt.getState();
    let optimized = Prompt.create();

    // 1. Optimize Role
    if (state.role) {
      optimized = optimized.role(this.stripFillerWords(state.role));
    }

    // 2. Optimize Task
    if (state.task) {
      optimized = optimized.task(this.stripFillerWords(state.task));
    }

    // 3. Deduplicate and Optimize Contexts
    const uniqueContexts = Array.from(new Set(state.contexts));
    for (const ctx of uniqueContexts) {
      optimized = optimized.context(this.stripFillerWords(ctx));
    }

    // 4. Deduplicate and Strengthen Constraints
    const uniqueConstraints = Array.from(new Set(state.constraints));
    for (const constraint of uniqueConstraints) {
      const cleanConstraint = this.stripFillerWords(constraint);
      // Strengthen constraint by prefixing if not already strong
      const strengthened = cleanConstraint.match(/^(CRITICAL|MUST|NEVER)/i)
        ? cleanConstraint
        : `MUST: ${cleanConstraint}`;
      optimized = optimized.constraint(strengthened);
    }

    // 5. Port over exact structure for the rest
    if (state.output) {
      optimized = optimized.output(state.output);
    }

    if (state.language) {
      optimized = optimized.language(state.language);
    }

    if (state.tone) {
      optimized = optimized.tone(state.tone);
    }

    if (state.audience) {
      optimized = optimized.audience(state.audience);
    }

    if (state.memory) {
      optimized = optimized.memory(state.memory);
    }

    for (const ex of state.examples) {
      optimized = optimized.example(ex.input, ex.output);
    }

    return optimized;
  }

  /**
   * Removes conversational filler words that consume tokens but provide zero semantic value.
   */
  private stripFillerWords(text: string): string {
    let optimized = text;
    const fillers = [
      /please /gi,
      /could you /gi,
      /i would like you to /gi,
      /can you /gi,
      /would you mind /gi,
      /it would be great if you could /gi,
    ];

    for (const regex of fillers) {
      optimized = optimized.replace(regex, '');
    }

    // Capitalize first letter if it was lowercased by the strip
    if (optimized.length > 0) {
      optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1);
    }

    // Collapse multiple spaces
    optimized = optimized.replace(/\s{2,}/g, ' ').trim();

    return optimized;
  }
}
