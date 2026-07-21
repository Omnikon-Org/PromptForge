import { PromptFormatter } from './formatters/types';
import { MarkdownFormatter } from './formatters/MarkdownFormatter';
import { PromptValidator } from './validation/Validator';
import type { ValidationResult } from './validation/types';
import { inspectPrompt, InspectionReport, Diagnostic } from '../inspection';
import { CostEstimate } from '../cost';

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
   *
   * @example
   * ```typescript
   * const prompt = Prompt.create();
   * ```
   *
   * @returns A fresh, immutable Prompt builder instance.
   */
  public static create(): Prompt {
    return new Prompt();
  }

  /**
   * Rehydrates a Prompt builder instance from an existing state object.
   * Useful when loading saved prompts from a database or JSON configuration.
   *
   * @param state The raw prompt state object to hydrate from.
   * @returns A new Prompt builder instance initialized with the given state.
   */
  public static fromState(state: PromptState): Prompt {
    return new Prompt(state);
  }

  /**
   * Sets the persona or role for the prompt.
   * Defining a role helps the LLM adopt a specific persona, tone, and expertise.
   *
   * @example
   * ```typescript
   * .role("Senior Systems Engineer")
   * ```
   *
   * @param text The role or persona description.
   * @returns A new Prompt instance with the updated role.
   */
  public role(text: string): Prompt {
    return new Prompt({ ...this.state, role: text });
  }

  /**
   * Sets the primary objective or task for the LLM to complete.
   * This is typically the main instruction of the prompt.
   *
   * @example
   * ```typescript
   * .task("Analyze the provided JSON payload and extract all user email addresses.")
   * ```
   *
   * @param text The specific task or instruction.
   * @returns A new Prompt instance with the updated task.
   */
  public task(text: string): Prompt {
    return new Prompt({ ...this.state, task: text });
  }

  /**
   * Appends contextual information to the prompt.
   * Can be called multiple times to build up context incrementally.
   *
   * @example
   * ```typescript
   * .context("The user is on a free tier subscription.")
   * .context("The current date is 2024-05-12.")
   * ```
   *
   * @param text The contextual information to append.
   * @returns A new Prompt instance with the appended context.
   */
  public context(text: string): Prompt {
    return new Prompt({
      ...this.state,
      contexts: [...this.state.contexts, text],
    });
  }

  /**
   * Appends a strict rule or constraint that the LLM must follow.
   * Can be called multiple times.
   *
   * @example
   * ```typescript
   * .constraint("Never output markdown formatting.")
   * .constraint("Keep the response under 50 words.")
   * ```
   *
   * @param text The rule or constraint to append.
   * @returns A new Prompt instance with the appended constraint.
   */
  public constraint(text: string): Prompt {
    return new Prompt({
      ...this.state,
      constraints: [...this.state.constraints, text],
    });
  }

  /**
   * Sets the desired output format or schema.
   *
   * @example
   * ```typescript
   * .output("A valid JSON array of strings.")
   * ```
   *
   * @param format The description of the required output format.
   * @returns A new Prompt instance with the updated output format.
   */
  public output(format: string): Prompt {
    return new Prompt({ ...this.state, output: format });
  }

  /**
   * Sets the required language of the response.
   *
   * @example
   * ```typescript
   * .language("French")
   * ```
   *
   * @param lang The language the LLM should respond in.
   * @returns A new Prompt instance with the updated language.
   */
  public language(lang: string): Prompt {
    return new Prompt({ ...this.state, language: lang });
  }

  /**
   * Sets the desired tone of voice.
   *
   * @example
   * ```typescript
   * .tone("Professional and concise")
   * ```
   *
   * @param tone The tone the LLM should adopt.
   * @returns A new Prompt instance with the updated tone.
   */
  public tone(tone: string): Prompt {
    return new Prompt({ ...this.state, tone: tone });
  }

  /**
   * Sets the target audience for the output.
   *
   * @example
   * ```typescript
   * .audience("Beginner programmers who are new to React.")
   * ```
   *
   * @param target The target audience description.
   * @returns A new Prompt instance with the updated audience.
   */
  public audience(target: string): Prompt {
    return new Prompt({ ...this.state, audience: target });
  }

  /**
   * Appends a few-shot example demonstrating the expected behavior.
   * Providing examples significantly improves LLM output reliability.
   * Can be called multiple times.
   *
   * @param input The user input or prompt trigger.
   * @param output The expected ideal response from the LLM.
   * @returns A new Prompt instance with the appended example.
   */
  public example(input: string, output: string): Prompt {
    return new Prompt({
      ...this.state,
      examples: [...this.state.examples, { input, output }],
    });
  }

  /**
   * Sets memory or chat history context for conversational prompts.
   *
   * @param text The conversational history or memory context.
   * @returns A new Prompt instance with the updated memory.
   */
  public memory(text: string): Prompt {
    return new Prompt({ ...this.state, memory: text });
  }

  /**
   * Returns a deeply cloned, structured state of the builder.
   * This state object can be serialized to JSON, logged, or passed to `fromState()`.
   *
   * @returns The raw state representing the current prompt configuration.
   */
  public getState(): PromptState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Validates the current prompt state using a robust set of rules.
   *
   * @param validator Optional custom validator instance. Defaults to `PromptValidator`.
   * @returns A validation result object containing any errors or warnings.
   */
  public validate(validator: PromptValidator = new PromptValidator()): ValidationResult {
    return validator.validate(this.state);
  }

  /**
   * Compiles the internal state into a final formatted string ready to be sent to an LLM.
   *
   * @param formatter Optional custom formatter instance. Defaults to `MarkdownFormatter`.
   * @returns The final string representation of the prompt.
   */
  public build(formatter: PromptFormatter = new MarkdownFormatter()): string {
    return formatter.format(this.state);
  }

  /**
   * Inspects the prompt to provide detailed analytics including token counts,
   * cost estimates, diagnostics, and context window checks.
   *
   * @param options Inspection options including the target model.
   * @returns An InspectionReport object.
   */
  public async inspect(options: { model?: string } = {}): Promise<InspectionReport> {
    const compiled = this.build();
    return inspectPrompt(compiled, options);
  }

  /**
   * Returns just the estimated token count for the prompt.
   * Uses the underlying `inspect()` pipeline.
   */
  public async tokens(options: { model?: string } = {}): Promise<number> {
    const report = await this.inspect(options);
    return report.tokens;
  }

  /**
   * Returns just the estimated cost for the prompt.
   * Uses the underlying `inspect()` pipeline.
   */
  public async cost(options: { model?: string } = {}): Promise<CostEstimate> {
    const report = await this.inspect(options);
    return report.cost;
  }

  /**
   * Alias for `inspect()` to provide a chainable DX for stats.
   */
  public async stats(options: { model?: string } = {}): Promise<InspectionReport> {
    return this.inspect(options);
  }

  /**
   * Returns diagnostics (warnings, errors) for the prompt.
   * Emulates ESLint-style output.
   */
  public async lint(options: { model?: string } = {}): Promise<Diagnostic[]> {
    const report = await this.inspect(options);
    return report.diagnostics;
  }

  /**
   * Alias for `inspect()` for comprehensive analysis.
   */
  public async analyze(options: { model?: string } = {}): Promise<InspectionReport> {
    return this.inspect(options);
  }
}
