<div align="center">
  <h1>📐 PromptForge Schema</h1>
  <p><strong>Strict output formatting and validation integrations for prompts.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/schema"><img src="https://img.shields.io/npm/v/@promptforgee/schema?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/schema"><img src="https://img.shields.io/npm/dm/@promptforgee/schema?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/schema?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

One of the biggest challenges in working with LLMs is ensuring they return structured data (like JSON) that perfectly matches your application's expected types.

**`@promptforgee/schema`** is designed to bridge the gap between `@promptforgee/core` and popular schema validation libraries like Zod, Yup, and TypeBox. It will automatically translate your TypeScript schemas into strict prompt constraints and provide parsers to validate the LLM's response.

> [!WARNING]  
> This package is currently in early development. The APIs described below are planned features.

## Features

- 🚧 **Zod Integration:** Convert Zod schemas directly into prompt instructions.
- 🚧 **Auto-parsing:** Automatically parse and validate LLM string responses against the schema.
- 🚧 **Retry Logic Generation:** Generate automated "correction" prompts when the LLM outputs invalid JSON.
- 🚧 **Type-safe End-to-End:** Ensure the data returned by the LLM matches your TypeScript interfaces.

## Installation

```bash
# npm
npm install @promptforgee/schema

# pnpm
pnpm add @promptforgee/schema

# yarn
yarn add @promptforgee/schema

# bun
bun add @promptforgee/schema
```

## Quick Start

```typescript
import { hello } from '@promptforgee/schema';

// Currently exports a placeholder testing function.
console.log(hello());
// Outputs: "Hello from @promptforgee/schema"
```

## API Overview

### Current API

| Export    | Description                                      |
| --------- | ------------------------------------------------ |
| `hello()` | A placeholder function ensuring package linking. |

### 🚧 Planned API

| Export                               | Description                                                |
| ------------------------------------ | ---------------------------------------------------------- |
| 🚧 `withZod(prompt, schema)`         | Injects a Zod schema definition into a Prompt builder.     |
| 🚧 `parseResponse(response, schema)` | Parses an LLM response and strictly validates it.          |
| 🚧 `withTypeBox(prompt, schema)`     | Injects a TypeBox schema definition into a Prompt builder. |

## Real-world Example (🚧 Planned)

_The following code demonstrates how we envision this package being used in the future:_

```typescript
import { Prompt } from '@promptforgee/core';
import { withZod, parseResponse } from '@promptforgee/schema';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

async function extractUserData(rawText: string) {
  // 1. Build prompt and inject schema constraints
  const prompt = Prompt.create().task(`Extract user data from: ${rawText}`);

  // 🚧 Planned API
  const strictPrompt = withZod(prompt, UserSchema);

  // 2. Fetch from LLM
  const llmResponseString = await runLLM(strictPrompt.build());

  // 3. Parse and validate
  // 🚧 Planned API
  const parsedData = parseResponse(llmResponseString, UserSchema);

  // parsedData is fully typed as { name: string, age: number, email: string }
  return parsedData;
}
```

## Ecosystem

`@promptforgee/schema` acts as the data-contract layer for PromptForge.

**[@promptforgee/core](../core)** (Builds the prompt)
↓
**@promptforgee/schema** (You are here)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/schema](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 Full integration with `zod`.
- 🚧 Full integration with `@sinclair/typebox`.
- 🚧 Auto-retry middleware for failed validations.

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
