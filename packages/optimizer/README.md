<div align="center">
  <h1>⚡ PromptForge Optimizer</h1>
  <p><strong>Automatically clean, deduplicate, and strengthen your structured prompts.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/optimizer"><img src="https://img.shields.io/npm/v/@promptforgee/optimizer?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/optimizer"><img src="https://img.shields.io/npm/dm/@promptforgee/optimizer?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/optimizer?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

As prompts grow in complexity, they often accumulate filler words, redundant context, and weak constraints. This inflates token costs and can confuse LLMs, degrading output quality.

**`@promptforgee/optimizer`** takes a `@promptforgee/core` `Prompt` instance and returns a highly optimized equivalent. It trims the fat, deduplicates information, and transforms passive constraints into strict directives, ensuring your prompts are as lean and effective as possible.

## Features

- **Token Reduction:** Strips out filler words ("please", "can you", etc.) without losing intent.
- **Deduplication:** Merges identical or highly similar context blocks and constraints.
- **Constraint Strengthening:** Converts weak language ("try to avoid") into strict imperatives ("DO NOT").
- **Seamless Integration:** Operates directly on `Prompt` instances from `@promptforgee/core`.

## Installation

```bash
# npm
npm install @promptforgee/optimizer

# pnpm
pnpm add @promptforgee/optimizer

# yarn
yarn add @promptforgee/optimizer

# bun
bun add @promptforgee/optimizer
```

## Quick Start

```typescript
import { Prompt, MarkdownFormatter } from '@promptforgee/core';
import { optimizePrompt } from '@promptforgee/optimizer';

async function main() {
  // A poorly constructed, verbose prompt
  const messyPrompt = Prompt.create()
    .task('Can you please write a function to sort an array for me?')
    .constraint('Try to avoid using O(n^2) time complexity if you can.')
    .constraint("Please don't use O(n^2) time.") // Redundant
    .context('The array contains numbers.')
    .context('The array contains numbers.'); // Redundant

  console.log('--- Before Optimization ---');
  console.log(messyPrompt.build(new MarkdownFormatter()));

  // Optimize the prompt
  const optimizedPrompt = await optimizePrompt(messyPrompt);

  console.log('\n--- After Optimization ---');
  console.log(optimizedPrompt.build(new MarkdownFormatter()));
}

main();
```

## API Overview

### `optimizePrompt(prompt: Prompt): Promise<Prompt>`

The primary exported function. Accepts a `Prompt` instance and returns a new, optimized `Prompt` instance.

### `HeuristicOptimizer`

The underlying optimizer class. Currently utilizes heuristic rules (Regex, deduplication logic) to clean the prompt state.

| Method                      | Description                             |
| --------------------------- | --------------------------------------- |
| `.optimize(prompt: Prompt)` | Returns an optimized `Prompt` instance. |

## Real-world Example

Building a self-healing prompt pipeline where generated prompts are automatically cleaned before execution:

```typescript
import { Prompt } from '@promptforgee/core';
import { optimizePrompt } from '@promptforgee/optimizer';

// User-provided inputs are often messy
function createQueryPrompt(userTask: string, extraContext: string[]) {
  const basePrompt = Prompt.create().task(userTask);

  extraContext.forEach((ctx) => basePrompt.context(ctx));

  // Clean up user messiness automatically
  return optimizePrompt(basePrompt);
}
```

## Ecosystem

`@promptforgee/optimizer` is the refinement step in the PromptForge lifecycle.

**[@promptforgee/core](../core)** (Builds the prompt)
↓
**[@promptforgee/analyzer](../analyzer)** (Analyzes the prompt)
↓
**@promptforgee/optimizer** (You are here)
↓
**[@promptforgee/registry](../registry)** (Stores the optimized prompt)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/optimizer](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 LLM-backed optimization engine for deep semantic deduplication.
- 🚧 Configuration options to tune optimization aggressiveness.

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
