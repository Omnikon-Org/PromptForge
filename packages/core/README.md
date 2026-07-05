# `@promptforgee/core`

> The core Prompt Builder engine for the PromptForge ecosystem.

## Overview

`@promptforgee/core` provides the fundamental primitives for constructing robust, type-safe, and highly-adherent prompts for Large Language Models. It uses a fluent Builder pattern and is designed to have **zero external dependencies**.

## Installation

```bash
npm install @promptforgee/core
```

## Usage

```typescript
import { Prompt } from '@promptforgee/core';

const prompt = Prompt.create()
  .role('Data Scientist')
  .task('Analyze the provided CSV data and extract the top 3 trends.')
  .constraint('Only output valid JSON.')
  .constraint('Do not include explanatory markdown text.')
  .output('JSON array')
  .build();

console.log(prompt);
```

## Features

- **Zero Dependencies**: Lightweight and fast.
- **Isomorphic**: Runs natively in Node.js, Deno, Bun, Cloudflare Workers, Edge runtimes, and the Browser.
- **Immutable Builder**: Every chained method call returns a new instance, allowing you to safely share base prompts across different parts of your application without mutation side effects.

## License

MIT © Omnikon
