<div align="center">
  <h1>⚒️ PromptForge Core</h1>
  <p><strong>The foundational building blocks for type-safe, composable prompt engineering.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/core"><img src="https://img.shields.io/npm/v/@promptforgee/core?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/core"><img src="https://img.shields.io/npm/dm/@promptforgee/core?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/core?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

String concatenation is a fragile way to build AI prompts. It leads to hard-to-maintain code, context loss, and inconsistent formatting.

**`@promptforgee/core`** introduces a robust, builder-pattern API to programmatically construct, validate, and format prompts. By treating prompts as structured data rather than raw strings, you gain type safety, reusability, and guaranteed formatting that LLMs can parse reliably.

## Features

- **Builder Pattern API:** Construct prompts fluently step-by-step.
- **Structured State:** Prompts are immutable objects, preventing accidental side effects.
- **Built-in Validation:** Ensure your prompts have required contexts and constraints before sending them to an LLM.
- **Pluggable Formatters:** Output your prompt as Markdown, XML, or JSON seamlessly.
- **Zero Dependencies:** Extremely lightweight and fast.

## Installation

```bash
# npm
npm install @promptforgee/core

# pnpm
pnpm add @promptforgee/core

# yarn
yarn add @promptforgee/core

# bun
bun add @promptforgee/core
```

## Quick Start

```typescript
import { Prompt, MarkdownFormatter, PromptValidator } from '@promptforgee/core';

// 1. Build the prompt
const myPrompt = Prompt.create()
  .role('Senior Systems Engineer')
  .task('Analyze the provided JSON payload and extract all user email addresses.')
  .context('The user is on a free tier subscription.')
  .constraint('Never output markdown formatting.')
  .output('A valid JSON array of strings.')
  .example('{"user": {"email": "test@example.com"}}', '["test@example.com"]');

// 2. Validate the prompt (optional but recommended)
const validation = myPrompt.validate(new PromptValidator());
if (!validation.isValid) {
  console.error('Prompt has issues:', validation.errors);
}

// 3. Format to string
const finalPromptString = myPrompt.build(new MarkdownFormatter());

console.log(finalPromptString);
```

## API Overview

### `Prompt`

The core builder class for creating structured prompts.

| Method                    | Description                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| `Prompt.create()`         | Initializes a new, empty Prompt instance.                            |
| `Prompt.fromState(state)` | Rehydrates a Prompt instance from a serialized `PromptState` object. |
| `.role(text)`             | Sets the persona or role for the LLM to adopt.                       |
| `.task(text)`             | Sets the primary objective or task.                                  |
| `.context(text)`          | Appends contextual information. Can be chained multiple times.       |
| `.constraint(text)`       | Appends a strict rule or constraint. Can be chained.                 |
| `.output(format)`         | Sets the desired output schema/format.                               |
| `.language(lang)`         | Specifies the response language (e.g., "French").                    |
| `.tone(tone)`             | Sets the tone of voice (e.g., "Professional").                       |
| `.audience(target)`       | Defines the target audience for the output.                          |
| `.example(input, output)` | Appends a few-shot example.                                          |
| `.memory(text)`           | Sets conversation history/memory.                                    |
| `.getState()`             | Returns the raw, serializable JSON state of the prompt.              |
| `.validate(validator)`    | Validates the current state using a `PromptValidator`.               |
| `.build(formatter)`       | Compiles the state into a string using a `PromptFormatter`.          |

### Formatters

- **`MarkdownFormatter`**: Formats the prompt using clear Markdown headings (default).
- _(Additional formatters like `XmlFormatter` can be implemented by extending `PromptFormatter`)_

### Validation

- **`PromptValidator`**: Evaluates the prompt state for minimum requirements (e.g., ensuring a `task` exists) and returns a `ValidationResult`.

## Real-world Example

Building a dynamic prompt pipeline for an API endpoint:

```typescript
import { Prompt } from '@promptforgee/core';

export async function generateEmailReply(userQuery: string, userTier: string) {
  const basePrompt = Prompt.create()
    .role('Customer Support Representative')
    .task("Write a polite email reply resolving the customer's query.")
    .constraint('Keep the response under 100 words.')
    .tone('Empathetic and helpful');

  // Dynamically inject context based on application state
  const contextualPrompt = basePrompt
    .context(`Customer query: ${userQuery}`)
    .context(`User tier: ${userTier}`);

  if (userTier === 'Enterprise') {
    return contextualPrompt
      .constraint('Offer a direct phone call with an account manager.')
      .build();
  }

  return contextualPrompt.build();
}
```

## Ecosystem

`@promptforgee/core` is the engine that powers the entire PromptForge ecosystem.

**@promptforgee/core** (You are here)
↓
**[@promptforgee/analyzer](../analyzer)** (Analyzes core prompts)
↓
**[@promptforgee/optimizer](../optimizer)** (Optimizes core prompts)
↓
**[@promptforgee/registry](../registry)** (Stores core prompts)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/core](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 Built-in XML and JSON Formatters
- 🚧 Token counting estimations
- 🚧 Support for multimodal attachments (images/audio)

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
