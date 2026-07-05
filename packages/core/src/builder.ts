import { PromptFormatter } from './formatters/types';
import { MarkdownFormatter } from './formatters/MarkdownFormatter';
import { PromptValidator } from './validation/Validator';
import type { ValidationResult } from './validation/types';

export interface PromptExample {
  input: string;
  output: string;
}

export interface PromptState {
  role?: string;
  task?: string;
  contexts: string[];
  constraints: string[];
  output?: string;
  language?: string;
  tone?: string;
  audience?: string;
  examples: PromptExample[];
  memory?: string;
}

const DEFAULT_STATE: PromptState = {
  contexts: [],
  constraints: [],
  examples: [],
};

export class Prompt {
  private state: PromptState;

  private constructor(state: PromptState = DEFAULT_STATE) {
    this.state = state;
  }

  /**
   * Initializes a new Prompt builder instance.
   */
  public static create(): Prompt {
    return new Prompt();
  }

  /**
   * Rehydrates a Prompt builder instance from an existing state object.
   */
  public static fromState(state: PromptState): Prompt {
    return new Prompt(state);
  }

  /**
   * Sets the persona or role for the prompt (e.g., "Expert copywriter").
   */
  public role(text: string): Prompt {
    return new Prompt({ ...this.state, role: text });
  }

  /**
   * Sets the primary objective or task.
   */
  public task(text: string): Prompt {
    return new Prompt({ ...this.state, task: text });
  }

  /**
   * Appends contextual information. Can be called multiple times.
   */
  public context(text: string): Prompt {
    return new Prompt({
      ...this.state,
      contexts: [...this.state.contexts, text],
    });
  }

  /**
   * Appends a rule or constraint. Can be called multiple times.
   */
  public constraint(text: string): Prompt {
    return new Prompt({
      ...this.state,
      constraints: [...this.state.constraints, text],
    });
  }

  /**
   * Sets the desired output format (e.g., "JSON", "Markdown table").
   */
  public output(format: string): Prompt {
    return new Prompt({ ...this.state, output: format });
  }

  /**
   * Sets the required language of the response.
   */
  public language(lang: string): Prompt {
    return new Prompt({ ...this.state, language: lang });
  }

  /**
   * Sets the desired tone of voice (e.g., "Professional", "Humorous").
   */
  public tone(tone: string): Prompt {
    return new Prompt({ ...this.state, tone: tone });
  }

  /**
   * Sets the target audience for the output.
   */
  public audience(target: string): Prompt {
    return new Prompt({ ...this.state, audience: target });
  }

  /**
   * Appends a few-shot example. Can be called multiple times.
   */
  public example(input: string, output: string): Prompt {
    return new Prompt({
      ...this.state,
      examples: [...this.state.examples, { input, output }],
    });
  }

  /**
   * Sets memory or chat history context.
   */
  public memory(text: string): Prompt {
    return new Prompt({ ...this.state, memory: text });
  }

  /**
   * Returns the current structured state of the builder.
   */
  public getState(): PromptState {
    return this.state;
  }

  /**
   * Validates the current prompt state using the provided or default validator.
   */
  public validate(validator: PromptValidator = new PromptValidator()): ValidationResult {
    return validator.validate(this.state);
  }

  /**
   * Compiles the internal state into a formatted prompt string.
   * Defaults to Markdown formatting.
   */
  public build(formatter: PromptFormatter = new MarkdownFormatter()): string {
    return formatter.format(this.state);
  }
}
