<div align="center">
  <h1>📚 PromptForge Registry</h1>
  <p><strong>Version control and storage for your structured prompts.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/registry"><img src="https://img.shields.io/npm/v/@promptforgee/registry?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/registry"><img src="https://img.shields.io/npm/dm/@promptforgee/registry?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/registry?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

Prompts are an essential part of your application's logic, yet they are often scattered across files as raw strings. When prompts change, it's hard to track versions, rollback regressions, or share them across teams.

**`@promptforgee/registry`** provides a dedicated storage system for `@promptforgee/core` `Prompt` instances. It automatically handles version bumping, querying, and serialization, allowing you to treat your prompts as versioned assets.

## Features

- **Automatic Versioning:** Saving a prompt with an existing name automatically increments its version.
- **Tagging & Searching:** Organize and retrieve prompts based on semantic tags.
- **Adapter Pattern:** Easily swap storage backends (e.g., in-memory for testing, database for production).
- **Serialization:** Import and export your entire prompt registry to JSON seamlessly.

## Installation

```bash
# npm
npm install @promptforgee/registry @promptforgee/core

# pnpm
pnpm add @promptforgee/registry @promptforgee/core

# yarn
yarn add @promptforgee/registry @promptforgee/core

# bun
bun add @promptforgee/registry @promptforgee/core
```

## Quick Start

```typescript
import { Prompt } from '@promptforgee/core';
import { PromptRegistry, InMemoryAdapter } from '@promptforgee/registry';

async function main() {
  // Initialize the registry with an in-memory store
  const registry = new PromptRegistry(new InMemoryAdapter());

  const myPrompt = Prompt.create().task('Write a greeting message.');

  // Save version 1
  await registry.save('greeting-prompt', myPrompt, ['onboarding']);

  // Modify and save version 2
  const updatedPrompt = myPrompt.task('Write a warm, professional greeting message.');
  await registry.save('greeting-prompt', updatedPrompt, ['onboarding']);

  // Load the latest version
  const loadedPrompt = await registry.load('greeting-prompt');

  console.log(loadedPrompt?.getState().task);
  // Outputs: "Write a warm, professional greeting message."
}

main();
```

## API Overview

### `PromptRegistry`

The main interface for interacting with saved prompts.

| Method                        | Description                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `new PromptRegistry(adapter)` | Initializes the registry. Defaults to `InMemoryAdapter`.                                            |
| `.save(name, state, tags)`    | Saves a `Prompt` or `PromptState`. Auto-increments version if name exists.                          |
| `.load(name, version?)`       | Retrieves a specific version, or the latest if no version is provided. Returns a `Prompt` instance. |
| `.search(query)`              | Searches the registry by tags or name.                                                              |
| `.exportToJSON()`             | Exports all records to a serialized JSON string.                                                    |
| `.importFromJSON(json)`       | Imports records from a serialized JSON array.                                                       |

### Adapters

- **`InMemoryAdapter`**: A fast, memory-based storage engine ideal for local development, testing, or serverless cold starts.
- _(More adapters for Redis, PostgreSQL, and DynamoDB are planned)_

## Real-world Example

Exporting your prompts to disk during a CI build step for deployment:

```typescript
import { PromptRegistry } from '@promptforgee/registry';
import * as fs from 'fs';

async function buildPromptBundle(registry: PromptRegistry) {
  // Export all versioned prompts
  const jsonBundle = await registry.exportToJSON();

  // Save to disk to be bundled with the application
  fs.writeFileSync('./dist/prompts.json', jsonBundle);
  console.log('Successfully bundled all prompts!');
}
```

## Ecosystem

`@promptforgee/registry` is the storage layer for the PromptForge ecosystem.

**[@promptforgee/core](../core)** (Builds the prompt)
↓
**[@promptforgee/analyzer](../analyzer)** (Analyzes the prompt)
↓
**[@promptforgee/optimizer](../optimizer)** (Optimizes the prompt)
↓
**@promptforgee/registry** (You are here)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/registry](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 `RedisAdapter` for distributed prompt storage.
- 🚧 `PostgresAdapter` for persistent relational storage.
- 🚧 A/B Testing hooks to track prompt performance metrics.

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
