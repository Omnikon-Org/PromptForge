<div align="center">
  <h1>💻 PromptForge CLI</h1>
  <p><strong>The ultimate command-line interface for enterprise prompt engineering.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@promptforgee/cli"><img src="https://img.shields.io/npm/v/@promptforgee/cli?style=flat-square&color=blue" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@promptforgee/cli"><img src="https://img.shields.io/npm/dm/@promptforgee/cli?style=flat-square" alt="npm downloads" /></a>
    <img src="https://img.shields.io/npm/l/@promptforgee/cli?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open_Source-%E2%9D%A4-green?style=flat-square" alt="Open Source" />
  </p>
</div>

---

## Why this package exists

Evaluating and optimizing prompts should not require writing custom Node.js scripts every time.

**`@promptforgee/cli`** brings the power of the PromptForge ecosystem directly to your terminal. It allows developers to analyze raw prompts, optimize prompt files, manage configurations, and test output quality straight from the command line—integrating seamlessly into CI/CD pipelines or local development workflows.

## Features

- **Analyze on the Fly:** Get instant diagnostic reports on text files or piped input.
- **Optimize Locally:** Automatically rewrite messy prompt files into clean, optimized versions.
- **Template Generation:** Scaffold new PromptForge builder scripts instantly.
- **System Doctor:** Validate your environment and configuration.
- **Unix Philosophy:** Built to be piped, parsed, and integrated into shell scripts.

## Installation

```bash
# Global installation (recommended for CLI usage)
npm install -g @promptforgee/cli

# Local installation as a dev dependency
npm install -D @promptforgee/cli
```

_Note: You can also run it directly using `npx @promptforgee/cli <command>`._

## Quick Start

```bash
# Initialize a new PromptForge configuration in your project
promptforge init

# Analyze a raw text prompt file
promptforge analyze ./my-prompt.txt

# Optimize a prompt and output it to a new file
promptforge optimize ./messy-prompt.txt > ./clean-prompt.txt

# Scaffold a new prompt file using a template
promptforge template create CodeReviewer ./prompts/review.ts
```

## API Overview (Commands)

| Command             | Description                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `init`              | Creates a `promptforge.config.json` in the current directory.                                                |
| `analyze <file>`    | Runs `@promptforgee/analyzer` on the specified file and prints a diagnostic report.                          |
| `optimize <file>`   | Runs `@promptforgee/optimizer` on the specified file. Prints to stdout by default.                           |
| `doctor`            | Checks your environment, config files, and dependencies for issues.                                          |
| `template [action]` | Interacts with `@promptforgee/templates`. Use `ls` to list available templates or `create` to scaffold code. |
| `generate <file>`   | Compiles a TypeScript/JavaScript Prompt builder script into a final formatted string (e.g., Markdown).       |

## Real-world Example

Adding a CI check in GitHub Actions to ensure no bad prompts are merged into the `main` branch:

```yaml
# .github/workflows/prompt-check.yml
name: PromptLint
on: [pull_request]

jobs:
  lint-prompts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Analyze Prompts
        # Exits with error code 1 if analysis score falls below a threshold
        run: npx promptforge analyze ./prompts/*.txt --threshold 80
```

## Ecosystem

The CLI orchestrates various PromptForge packages through a unified command-line experience.

**@promptforgee/cli** (You are here)
↓
**[@promptforgee/analyzer](../analyzer)** (Powered by)
↓
**[@promptforgee/optimizer](../optimizer)** (Powered by)
↓
**[@promptforgee/templates](../templates)** (Powered by)

## Documentation

For full documentation and advanced usage, visit [promptforge.dev/docs/cli](https://github.com/Omnikon-Org/PromptForge).

## Examples

Check out our [Examples directory](https://github.com/Omnikon-Org/PromptForge/tree/main/examples) for more real-world use cases.

## Roadmap

- 🚧 Interactive Prompt REPL (Read-Eval-Print Loop) for testing against LLMs directly.
- 🚧 Git pre-commit hooks integration.
- 🚧 Bulk analysis formatting (JSON, CSV output).

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/Omnikon-Org/PromptForge/blob/main/CONTRIBUTING.md) to get started.

## License

MIT © [Omnikon-Org](https://github.com/Omnikon-Org)
