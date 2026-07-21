<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/Omnikon-Org/PromptForge/main/docs/public/PromptForgeLogo.png" alt="PromptForge Logo" width="200" />
  <br />
  <h3>Engineer Better AI Prompts</h3>
  <p><strong>The professional, open-source Prompt Engineering toolkit for TypeScript.</strong></p>

[![npm version](https://img.shields.io/npm/v/@promptforgee/core.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@promptforgee/core)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Omnikon-Org/PromptForge/ci.yml?branch=main&style=for-the-badge&logo=github)](https://github.com/Omnikon-Org/PromptForge/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@promptforgee/core.svg?style=for-the-badge)](https://github.com/Omnikon-Org/PromptForge/blob/main/LICENSE)

  <br />
</div>

## Overview

**PromptForge** is a production-grade prompt engineering toolkit designed to bring type safety, immutability, and structured composition to your AI pipelines. It is built specifically for developers who treat prompts like real software.

Stop concatenating messy, fragile string templates. Start constructing robust, auditable, and highly-optimized AI interactions that run flawlessly across OpenAI, Anthropic, Gemini, and Ollama.

## Why PromptForge?

The current state of AI engineering is plagued by brittle string interpolations, invisible whitespace bugs, and unstructured constraints. PromptForge solves this by introducing a robust **Builder Pattern**:

- 🏗 **Immutable Builder:** Construct complex prompts programmatically with zero runtime string interpolation bugs.
- 🛡 **Strict Validation & Diagnostics:** Catch missing contexts, ambiguous rules, empty roles, and token limits at compilation time.
- ⚡️ **Type Safety:** Integrated natively with TypeScript to ensure your prompts are robust before execution.
- ⚛️ **Zero Unnecessary Runtime Overhead:** Tokenizers and analytics are lazy-loaded. The core package remains blazing fast and capable of running anywhere (Node.js, Edge, Browser, Cloudflare Workers).
- 🔄 **Provider Agnostic:** Compile prompts optimized for any LLM architecture without changing your core builder logic.

## Installation

PromptForge is distributed on npm. Install the core package using your preferred package manager:

```bash
npm install @promptforgee/core @promptforgee/analyzer
```

```bash
pnpm add @promptforgee/core @promptforgee/analyzer
```

```bash
yarn add @promptforgee/core @promptforgee/analyzer
```

## Quick Start

PromptForge uses a fluent, chainable API to construct your prompts. Under the hood, it structures the prompt in a way that minimizes LLM hallucination and maximizes adherence to instructions.

```typescript
import { Prompt } from '@promptforgee/core';

const prompt = Prompt.create()
  .role('Expert Senior Security Engineer')
  .task('Review the provided source code for security vulnerabilities.')
  .constraint('Include CVSS scores for each vulnerability.')
  .constraint('Do not flag false positives for test files.')
  .context('The codebase uses Express and Node.js v20.')
  .output('JSON array of vulnerability objects adhering to the provided schema.');

console.log(prompt.build());
```

## Advanced Analytics & Developer Experience

PromptForge acts like ESLint, Prettier, and TypeScript for your prompts.

### The Unified Inspection API

```typescript
const report = await prompt.inspect({ model: 'gpt-4o' });

console.log(`Tokens: ${report.tokens}`);
console.log(`Estimated Cost: $${report.cost.totalCost}`);
console.log(`Context Fits: ${report.context.fits}`);

// Or use the chainable convenience methods:
const tokens = await prompt.tokens();
const cost = await prompt.cost({ model: 'claude-3-opus-20240229' });
const diagnostics = await prompt.lint();
```

### The Model Registry

Token counting, cost estimation, and context limits are handled seamlessly via a centralized `ModelRegistry` that supports custom model definitions.

```typescript
import { ModelRegistry } from '@promptforgee/core';

ModelRegistry.registerModel({
  name: 'my-custom-model',
  provider: 'local',
  family: 'llama',
  maxContext: 8192,
  pricing: { inputPer1k: 0.001, outputPer1k: 0.002, currency: 'USD' },
  tokenizer: () => import('@promptforgee/core').then((m) => m.countTokens),
});
```

## Provider Compatibility

PromptForge is designed to be universally compatible with the major AI providers:

### OpenAI

Works perfectly as the `content` of the `system` or `user` message in the `gpt-4o` Chat Completions API.

### Anthropic

Inject the compiled PromptForge output directly into the `system` parameter for Claude 3.5 Sonnet to achieve maximum instruction following.

### Gemini

Pass the compiled string to the Google Generative AI `SystemInstruction` or `contents` array.

### Ollama

Use it flawlessly with local models like `llama3` or `mistral` by piping the compiled string to the Ollama generate endpoint.

## The CLI Toolkit

PromptForge ships with a powerful CLI to analyze and format your prompts without writing any code.

```bash
npx promptforge doctor my-prompt.md    # High-level health and context check
npx promptforge lint my-prompt.md      # ESLint-style diagnostics and warnings
npx promptforge stats my-prompt.md     # Generate a cost and token matrix for various models
npx promptforge analyze my-prompt.md   # Semantic analysis and clarity scoring
npx promptforge format --write my-prompt.md  # Prettier for prompts
```

## API Reference

| Method              | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `Prompt.create()`   | Initializes a new, empty Prompt builder instance.                        |
| `.role(text)`       | Sets the persona or system role the AI should adopt.                     |
| `.task(text)`       | Defines the primary objective or action to complete.                     |
| `.constraint(text)` | Adds a strict rule or negative constraint. Can be called multiple times. |
| `.context(text)`    | Provides background information or data.                                 |
| `.output(text)`     | Defines the exact format the AI should return (e.g. JSON).               |
| `.build()`          | Compiles the builder state into a final, structured string.              |
| `.inspect(opts)`    | Returns a unified report containing tokens, cost, and diagnostics.       |
| `.tokens(opts)`     | Calculates the expected input token count for a given model.             |
| `.cost(opts)`       | Estimates the API cost for processing the prompt.                        |
| `.lint(opts)`       | Returns an array of ESLint-style warnings and syntax errors.             |

## Roadmap

- [ ] **PromptForge Zod Integration:** Native schema injection and validation.
- [ ] **PromptForge Optimizer:** Heuristic engine to strip filler words and optimize context windows.
- [ ] **React Components:** Headless UI hooks for prompt management.

## FAQ

**Does this make the API request for me?**  
No. PromptForge is strictly a prompt _construction_ and _compilation_ library. You pass the compiled string to the official OpenAI, Anthropic, or Vercel AI SDKs.

**Will this increase my token count?**  
PromptForge adds a few structural markdown headers (like `# TASK`). These tiny additions cost fractions of a cent but drastically reduce hallucination and retry rates, saving you significant money and latency overall.

## Contributing

We love our contributors! Please read our [Contributing Guide](./CONTRIBUTING.md) to learn how to set up the repository locally, run tests, and create changesets for pull requests.

Please note that we have a [Code of Conduct](./CODE_OF_CONDUCT.md); please follow it in all your interactions with the project.

## Security

If you discover a security vulnerability within PromptForge, please refer to our [Security Policy](./SECURITY.md).

## License

PromptForge is Open Source software released under the [MIT License](./LICENSE).

---

<div align="center">
  <b>PromptForge</b> • Built with passion by <a href="https://github.com/Omnikon-Org">Omnikon</a>
</div>
