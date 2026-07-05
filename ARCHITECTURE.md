# Architecture Blueprint: PromptForge

**Status:** Draft  
**Context:** Initial Design Phase  
**Author:** Staff Software Architect

---

## 1. Vision

PromptForge aims to be the foundational, production-grade prompt engineering toolkit for the AI era. Similar to how Prisma revolutionized database access and Zod brought rigorous type safety to JavaScript, PromptForge brings structure, validation, optimization, and observability to prompts. It transitions prompt engineering from string concatenation and guesswork to a typed, predictable, and measurable software engineering discipline.

## 2. Problem Statement

As LLMs become central to modern applications, developers face several critical issues:

- **Fragility:** Prompts are often treated as loose strings scattered across codebases.
- **Lack of Type Safety:** Variables injected into prompts are unvalidated, leading to runtime hallucination or injection attacks.
- **Poor Observability:** It is extremely difficult to track which prompt version produced which completion in production.
- **No Standardization:** There is no standard way to parse, construct, or optimize prompts programmatically.
- **Vendor Lock-in:** Moving a prompt from OpenAI to Anthropic often requires rewriting the prompt structure due to differing optimal formats.

## 3. Why PromptForge Should Exist

PromptForge bridges the gap between experimental prompt hacking and enterprise software engineering. It exists to provide:

1. **Type Safety:** Schema-driven prompt variables and outputs.
2. **Modularity:** Composable prompt components (similar to React components but for context windows).
3. **Tooling:** A CLI and VSCode extension for offline analysis and linting.
4. **Interoperability:** Agnostic to the underlying model provider.

## 4. Target Audience

- **Full-stack Developers** building AI-integrated applications.
- **AI/ML Engineers** managing complex prompt pipelines and evaluations.
- **Platform Teams** aiming to standardize AI usage across an organization.
- **Open Source Maintainers** building wrappers around AI APIs.

## 5. Competitor Analysis

| Competitor              | Strengths                                  | Weaknesses                                                  | PromptForge Differentiation                                                               |
| :---------------------- | :----------------------------------------- | :---------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **LangChain**           | Massive ecosystem, extensive integrations. | Bloated, overly complex abstractions, hard to debug.        | Lean, focused strictly on prompts (not agents/memory), highly modular, native TS focus.   |
| **LlamaIndex**          | Excellent for RAG and data connections.    | Specific to data ingestion, not general prompt engineering. | PromptForge acts as the foundational layer that could theoretically feed into LlamaIndex. |
| **Outlines / Guidance** | Great control over generation (Python).    | Mostly Python-centric, tied to specific inference engines.  | TypeScript-first, isomorphic (runs in Edge/Browser/Node).                                 |

## 6. Product Roadmap

### Features for v1 (Foundation & Type Safety)

- Type-safe prompt templates using template literals and Zod schemas.
- Basic prompt composition (nesting prompts).
- Provider-agnostic AST (Abstract Syntax Tree) for prompts.
- `core` engine for compilation and execution.
- CLI for simple prompt validation.

### Features for v2 (Optimization & Reactivity)

- **Prompt Optimizer:** Automatic compression of prompts (token reduction) without losing semantic meaning.
- **React Integration:** `<Prompt />` components for dynamic, state-driven prompt generation in frontend/edge environments.
- **Analyzer:** Static analysis to detect prompt injection vulnerabilities and token limits.
- **VSCode Extension:** Syntax highlighting, autocomplete for prompt variables, and hover-to-see token count.

### Features for v3 (Ecosystem & Registry)

- **Prompt Registry:** A schema-driven, version-controlled remote prompt storage system.
- **A/B Testing:** Built-in hooks for routing and evaluating prompt variations.
- **Plugin Architecture:** Community-driven plugins for custom syntax or provider specific optimizations.
- **Observability:** Telemetry hooks (OpenTelemetry standard) for tracing prompt performance.

---

## 7. Package Architecture

The project will be structured as a heavily modularized monorepo to ensure consumers only ship the code they need.

```mermaid
graph TD
    A[@promptforgee/core] --> B[@promptforgee/schema]
    C[@promptforgee/react] --> A
    D[@promptforgee/analyzer] --> A
    E[@promptforgee/optimizer] --> A
    F[@promptforgee/cli] --> A
    F --> D
    F --> E
    G[@promptforgee/vscode] --> D
    H[@promptforgee/registry] --> A
```

- `@promptforgee/core`: The compiler, AST, and base template engine.
- `@promptforgee/schema`: Zod/Valibot integrations for variable validation.
- `@promptforgee/analyzer`: Static analysis and token counting.
- `@promptforgee/optimizer`: Semantic compression and token optimization.
- `@promptforgee/react`: React bindings for building prompts declaratively.
- `@promptforgee/cli`: Command-line tools for linting and building.
- `@promptforgee/registry`: Client for remote prompt management.
- `@promptforgee/vscode`: IDE tooling for immediate feedback.

## 8. Monorepo Architecture

- **Tooling:** pnpm workspaces, TurboRepo for caching and parallel execution.
- **Bundling:** `tsup` for extremely fast, zero-config ESM/CJS builds.
- **Testing:** `vitest` for fast, watch-mode unit testing.
- **Formatting/Linting:** Prettier + ESLint + Husky + lint-staged.
- **Versioning/Releasing:** Changesets to manage semantic versioning across interdependent packages.

## 9. Public API Design

The API should feel as intuitive as template literals but as powerful as Zod.

```typescript
import { createPrompt } from '@promptforgee/core';
import { z } from '@promptforgee/schema';

// Define the schema for expected variables
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  role: z.enum(['admin', 'user']),
});

// Create a strictly typed prompt
const greetPrompt = createPrompt({
  name: 'greetPrompt',
  input: userSchema,
  template: (data) => `
    You are a helpful assistant.
    The user's name is ${data.name}.
    They are an ${data.role}.
    Respond appropriately.
  `,
});

// Compilation (Throws if variables don't match schema)
const compiled = greetPrompt.compile({ name: 'Alice', age: 28, role: 'admin' });
```

## 10. Internal Architecture

PromptForge will use a multi-stage pipeline internally:

1. **Parsing:** Template strings and variables are parsed into an AST.
2. **Validation:** Variables are run against schemas.
3. **Analysis (Optional):** AST is analyzed for tokens and security (Analyzer).
4. **Optimization (Optional):** AST nodes are pruned or compressed (Optimizer).
5. **Compilation:** AST is converted into a provider-specific string or message array.

## 11. Design Patterns

- **Builder Pattern:** Used for constructing complex prompts fluently.
- **Visitor Pattern:** Used extensively over the Prompt AST to apply plugins, optimizers, and token counters.
- **Adapter Pattern:** Used to translate the compiled AST into provider-specific formats (e.g., OpenAI ChatCompletion vs Anthropic Messages).
- **Isomorphism:** All core logic must avoid Node-specific APIs (`fs`, `path`) to run perfectly in browsers, Cloudflare Workers, and Deno.

## 12. TypeScript Strategy

- **Strict Mode:** `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`.
- **Inference First:** Rely heavily on generics and type inference so the user rarely has to write manual types.
- **Exporting Types:** All public types will be explicitly exported via `type` modifiers (`export type { ... }`).
- **Base TSConfig:** A central `tsconfig.base.json` in the root that all packages extend.

## 13. Testing Strategy

- **Unit Tests (Vitest):** Core AST, parsing logic, and schema validation. Aim for >95% coverage on `@promptforgee/core`.
- **Integration Tests:** Testing the React components with `@testing-library/react`.
- **E2E Tests:** Running the CLI against real repositories to test file output and exit codes.
- **Type Tests:** Using `tsd` or Vitest's `expectTypeOf` to ensure complex generics do not regress.

## 14. Release Strategy

- **Changesets:** Developers create markdown files describing changes alongside their PRs.
- **CI/CD:** GitHub Actions triggers on push to `main`, consumes changesets, creates a Release PR.
- **NPM Tags:** Use `@next` for pre-releases, and `@latest` for stable releases.
- **Changelog:** Automated generation via Changesets.

## 15. Documentation Strategy

- **Framework:** Nextra or VitePress for fast, markdown-based documentation.
- **Typedoc:** Automatically generate API reference from TSDoc comments in the codebase.
- **Examples:** A dedicated `examples/` folder in the monorepo demonstrating usage in Next.js, Express, and raw Node.

## 16. Scalability Considerations

- **Memory Footprint:** The AST generation must be lightweight. Using strings heavily can cause memory bloat; string pooling and efficient AST nodes are necessary.
- **Cold Starts:** Bundling via `tsup` will target edge environments, requiring minimal dependencies to keep cold start times sub-50ms.

## 17. Future Plugin Architecture

To avoid bloat, v3 will introduce a unified plugin interface hooking into the compilation lifecycle:

```typescript
interface PromptPlugin {
  name: string;
  onParse?: (ast: AST) => AST;
  onValidate?: (data: any, schema: Schema) => void;
  onCompile?: (output: string) => string;
}
```

This allows community members to build plugins for PII obfuscation, custom analytics, or proprietary tokenizers without touching the core library.

---

_End of Document_
