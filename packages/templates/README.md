<div align="center">
  <h1>📋 PromptForge Templates</h1>
  <p><strong>Ready-to-use, battle-tested prompt templates for common AI engineering tasks.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/templates"><img src="https://img.shields.io/npm/v/@promptforgee/templates?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/templates"><img src="https://img.shields.io/npm/dm/@promptforgee/templates?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/templates?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

Crafting the perfect system prompt for specific roles (like a Code Reviewer, Security Engineer, or Translator) requires significant trial and error.

**`@promptforgee/templates`** provides a library of pre-configured `@promptforgee/core` `Prompt` instances. These templates have been highly optimized and battle-tested in production to yield reliable, high-quality responses from leading LLMs. Instead of reinventing the wheel, simply import a template, inject your context, and execute.

## Features

- **Plug-and-Play:** Import a template and use it immediately.
- **Highly Tuned:** Pre-configured with optimal roles, tasks, constraints, and tones.
- **Composable:** Templates are `Prompt` instances, meaning you can chain additional `.context()` or `.constraint()` calls to customize them further.
- **Type-safe:** Fully integrated with `@promptforgee/core`.

## Installation

```bash
# npm
npm install @promptforgee/templates @promptforgee/core

# pnpm
pnpm add @promptforgee/templates @promptforgee/core

# yarn
yarn add @promptforgee/templates @promptforgee/core

# bun
bun add @promptforgee/templates @promptforgee/core
```

## Quick Start

```typescript
import { FrontendEngineer } from '@promptforgee/templates';
import { MarkdownFormatter } from '@promptforgee/core';

async function generateReactComponent(requirements: string) {
  // 1. Extend the pre-built template
  const myPrompt = FrontendEngineer.context(`Component Requirements: ${requirements}`).constraint(
    'Use Tailwind CSS for styling.',
  );

  // 2. Format it to a string
  const promptString = myPrompt.build(new MarkdownFormatter());

  // 3. Send to LLM...
  console.log(promptString);
}
```

## API Overview

Each export is a pre-configured `Prompt` builder instance from `@promptforgee/core`.

| Export             | Ideal Use Case                                              |
| ------------------ | ----------------------------------------------------------- |
| `FrontendEngineer` | Generating UI components, HTML/CSS, React/Vue code.         |
| `BackendEngineer`  | Writing server logic, API endpoints, database queries.      |
| `ReactExpert`      | Highly specialized React development with modern hooks.     |
| `CodeReviewer`     | Identifying bugs, performance issues, and code smells.      |
| `Teacher`          | Explaining complex technical concepts clearly to beginners. |
| `Interviewer`      | Conducting simulated technical interviews.                  |
| `Debugger`         | Analyzing stack traces and suggesting fixes.                |
| `SecurityEngineer` | Auditing code for vulnerabilities (XSS, SQLi, etc.).        |
| `Researcher`       | Summarizing academic papers or technical documentation.     |
| `Translator`       | Translating text across spoken or programming languages.    |
| `TechnicalWriter`  | Generating API documentation, READMEs, and guides.          |

## Real-world Example

Building a multi-agent CI/CD pipeline step:

```typescript
import { CodeReviewer, SecurityEngineer } from '@promptforgee/templates';

async function performAutomatedCodeReview(pullRequestDiff: string) {
  // Generate the review prompt
  const reviewPrompt = CodeReviewer.context(`PR Diff:\n${pullRequestDiff}`).build();

  // Generate the security audit prompt
  const securityPrompt = SecurityEngineer.context(`PR Diff:\n${pullRequestDiff}`)
    .constraint('Focus strictly on OWASP Top 10 vulnerabilities.')
    .build();

  // Execute both prompts in parallel via your LLM provider
  const [review, security] = await Promise.all([runLLM(reviewPrompt), runLLM(securityPrompt)]);

  return { review, security };
}
```

## Ecosystem

`@promptforgee/templates` provides the starting point for your PromptForge workflows.

**@promptforgee/templates** (You are here)
↓
**[@promptforgee/core](../core)** (Customize the template)
↓
**[@promptforgee/analyzer](../analyzer)** (Validate your additions)
↓
**[@promptforgee/optimizer](../optimizer)** (Optimize the final prompt)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/templates](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 `DataScientist` template for pandas/numpy data manipulation.
- 🚧 `DevOpsEngineer` template for Docker/Kubernetes/Terraform configurations.
- 🚧 Domain-specific templates (e.g., Legal Assistant, Financial Analyst).

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
