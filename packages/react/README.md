<div align="center">
  <h1>⚛️ PromptForge React</h1>
  <p><strong>React hooks and UI components for managing AI prompts.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/react"><img src="https://img.shields.io/npm/v/@promptforgee/react?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/react"><img src="https://img.shields.io/npm/dm/@promptforgee/react?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/react?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

Integrating dynamic prompts into React applications often involves managing complex state, handling loading states during LLM calls, and syncing context data (like user profiles or current page state) into prompts.

**`@promptforgee/react`** bridges the gap between `@promptforgee/core` and React. It will provide specialized hooks to build, update, and validate prompts responsively, along with headless UI components for prompt debugging and visualization.

> [!WARNING]  
> This package is currently in early development. The APIs described below are planned features.

## Features

- 🚧 **`usePrompt()` Hook:** Reactively build prompts based on component state.
- 🚧 **Context Syncing:** Automatically inject React Context values into your prompts.
- 🚧 **Headless UI Components:** Render prompt diagnostic reports directly in your app.
- 🚧 **Suspense Support:** Seamless integration with React Suspense for LLM streaming states.

## Installation

```bash
# npm
npm install @promptforgee/react

# pnpm
pnpm add @promptforgee/react

# yarn
yarn add @promptforgee/react

# bun
bun add @promptforgee/react
```

## Quick Start

```typescript
import { hello } from '@promptforgee/react';

// Currently exports a placeholder testing function.
console.log(hello());
// Outputs: "Hello from @promptforgee/react"
```

## API Overview

### Current API

| Export    | Description                                      |
| --------- | ------------------------------------------------ |
| `hello()` | A placeholder function ensuring package linking. |

### 🚧 Planned API

| Export                       | Description                                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| 🚧 `usePrompt(initialState)` | Hook to manage a Prompt builder instance with React state.            |
| 🚧 `PromptProvider`          | React Context provider to share base contexts globally.               |
| 🚧 `PromptDebugger`          | A headless component that renders an `@promptforgee/analyzer` report. |

## Real-world Example (🚧 Planned)

_The following code demonstrates how we envision this package being used in the future:_

```tsx
import { usePrompt } from '@promptforgee/react';
import { useUser } from './hooks/useUser';

export function EmailGenerator() {
  const { user } = useUser();
  const [topic, setTopic] = useState('');

  // 🚧 Planned hook usage
  const prompt = usePrompt()
    .role('Assistant')
    .task(`Write an email about: ${topic}`)
    .context(`User Name: ${user.name}`);

  const handleGenerate = async () => {
    const promptString = prompt.build();
    // await runLLM(promptString)...
  };

  return (
    <div>
      <input value={topic} onChange={(e) => setTopic(e.target.value)} />
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
}
```

## Ecosystem

`@promptforgee/react` will serve as the presentation layer for PromptForge.

**[@promptforgee/core](../core)** (Builds the underlying prompt)
↓
**@promptforgee/react** (You are here)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/react](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 Implement `usePrompt` with deep state equality checks.
- 🚧 Create the `<PromptDebugger />` component.
- 🚧 Add Next.js App Router specific hooks (`useServerPrompt`).

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
