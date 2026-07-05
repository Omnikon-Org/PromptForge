# Contributing to PromptForge

First off, thank you for considering contributing to PromptForge! It's people like you that make PromptForge such a great tool.

## Monorepo Setup

PromptForge is a monorepo managed using `pnpm` workspaces and `TurboRepo`.

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v9 or higher)

### 2. Installation

Clone the repository and install the dependencies:

\`\`\`bash
git clone https://github.com/promptforge/promptforge.git
cd promptforge
pnpm install
\`\`\`

### 3. Development Scripts

We use Turborepo to orchestrate tasks across all packages. You can run these commands from the root:

- \`pnpm run build\` - Builds all packages
- \`pnpm run test\` - Runs Vitest across all packages
- \`pnpm run lint\` - Lints the codebase
- \`pnpm run typecheck\` - Verifies TypeScript typings

## Creating a Pull Request

1. **Create a branch** for your feature or bugfix.
2. **Make your changes**. Ensure you write tests for any new features or bugfixes!
3. **Run the CI locally** (\`pnpm run test\` and \`pnpm run build\`).
4. **Create a changeset**. If your change affects the published packages, run \`pnpm changeset\` and follow the prompts. Commit the generated markdown file.
5. **Open a Pull Request** against the \`main\` branch.

## Code Style

- We use Prettier for code formatting.
- We strictly adhere to TypeScript's strict mode. Avoid \`any\` at all costs.

## Architecture

Please review \`ARCHITECTURE.md\` before making significant changes to the core algorithms, specifically the formatting and validation pipelines.
