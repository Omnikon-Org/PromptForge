<div align="center">
  <h1>📝 PromptForge VS Code Core</h1>
  <p><strong>Core logic for the PromptForge Visual Studio Code extension.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/vscode"><img src="https://img.shields.io/npm/v/@promptforgee/vscode?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/vscode"><img src="https://img.shields.io/npm/dm/@promptforgee/vscode?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/vscode?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

Providing developer-first tooling means bringing prompt engineering directly into the IDE.

**`@promptforgee/vscode`** contains the editor-agnostic core logic for the official PromptForge Visual Studio Code extension. By separating the logic from the VS Code API, we ensure that diagnostic linting, optimization suggestions, and autocomplete functionality can be rigorously tested and potentially reused in other editor environments (like Neovim or JetBrains).

> [!WARNING]  
> This package is currently in early development. The features described below are planned for the upcoming VS Code extension release.

## Features

- 🚧 **Real-time Diagnostics:** Interfaces with `@promptforgee/analyzer` to provide inline squiggly lines for weak prompt constraints.
- 🚧 **Code Actions:** Provides Quick Fixes (e.g., "Optimize prompt") powered by `@promptforgee/optimizer`.
- 🚧 **Hover Insights:** Shows prompt scores and token estimations when hovering over a `Prompt` instance.
- 🚧 **Editor Agnostic:** Pure TypeScript logic decoupled from `vscode` specific dependencies.

## Installation

```bash
# npm
npm install @promptforgee/vscode

# pnpm
pnpm add @promptforgee/vscode

# yarn
yarn add @promptforgee/vscode

# bun
bun add @promptforgee/vscode
```

_Note: This package is intended primarily for developers contributing to the PromptForge editor extensions. End-users should install the extension directly from the VS Code Marketplace._

## Quick Start

```typescript
import { hello } from '@promptforgee/vscode';

// Currently exports a placeholder testing function.
console.log(hello());
// Outputs: "Hello from @promptforgee/vscode"
```

## API Overview

### Current API

| Export    | Description                                      |
| --------- | ------------------------------------------------ |
| `hello()` | A placeholder function ensuring package linking. |

### 🚧 Planned API

| Export                                 | Description                                                                |
| -------------------------------------- | -------------------------------------------------------------------------- |
| 🚧 `provideDiagnostics(document)`      | Scans a document and returns analyzer issues as editor diagnostic objects. |
| 🚧 `provideCodeActions(diagnostic)`    | Maps an analysis suggestion to an automated editor fix.                    |
| 🚧 `calculateHoverMetrics(promptNode)` | Returns markdown string for hover tooltips.                                |

## Real-world Example (🚧 Planned)

_Internal architecture example for bridging the core logic to the VS Code API:_

```typescript
import * as vscode from 'vscode';
import { provideDiagnostics } from '@promptforgee/vscode';

// Inside the VS Code Extension activate() function:
export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('promptforge');

  // Listen to document changes
  vscode.workspace.onDidChangeTextDocument((event) => {
    // 🚧 Planned core logic execution
    const issues = provideDiagnostics(event.document.getText());

    // Map core issues to VS Code Diagnostics
    const vsDiagnostics = issues.map(
      (issue) =>
        new vscode.Diagnostic(
          new vscode.Range(issue.line, 0, issue.line, 100),
          issue.message,
          vscode.DiagnosticSeverity.Warning,
        ),
    );

    diagnosticCollection.set(event.document.uri, vsDiagnostics);
  });
}
```

## Ecosystem

`@promptforgee/vscode` brings the intelligence of the analyzer and optimizer directly to the developer's fingertips.

**[@promptforgee/analyzer](../analyzer)** (Provides the insights)
↓
**@promptforgee/vscode** (You are here)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/vscode](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 Establish Language Server Protocol (LSP) abstraction layer.
- 🚧 Integrate `@promptforgee/analyzer` for live diagnostics.
- 🚧 Integrate `@promptforgee/optimizer` for Quick Fixes.
- 🚧 Publish to the VS Code Marketplace.

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
