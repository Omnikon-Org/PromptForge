/* eslint-disable */
import { Metadata } from 'next';
import { CodeBlock } from '../../components/CodeBlock';

export const metadata: Metadata = {
  title: 'Documentation | PromptForge',
};

export default function DocsPage() {
  return (
    <div className="pb-16 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-6">Introduction</h1>
      <p className="text-lg text-muted-foreground mb-12">
        PromptForge is a production-grade prompt engineering toolkit designed to bring type safety,
        immutability, and heuristics-based optimization to your AI pipeline. It was built for
        developers who treat prompts like real software.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">The Problem</h2>
      <p className="mb-4 text-muted-foreground">
        Currently, most developers build AI prompts using massive, messy string templates (e.g.,{' '}
        <code>{`const prompt = \`Summarize: \${content}\``}</code>). This approach is highly
        problematic in production environments:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-8 text-muted-foreground">
        <li>
          <strong>No Type Safety:</strong> It is easy to forget a variable or inject a malformed
          object, confusing the LLM.
        </li>
        <li>
          <strong>Token Bloat:</strong> Developers repeat rules across different prompts. The LLM
          processes "filler words" and duplicate constraints, wasting tokens and driving up API
          costs.
        </li>
        <li>
          <strong>Hard to Scale:</strong> You cannot easily swap out parts of a string or share
          logic across a massive codebase safely.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Why PromptForge?</h2>
      <p className="mb-4 text-muted-foreground">
        PromptForge solves these issues by treating prompt engineering as{' '}
        <em>real software engineering</em>.
      </p>
      <ul className="list-disc list-inside space-y-2 mb-8 text-muted-foreground">
        <li>
          <strong>Immutability & Composability:</strong> Build libraries of reusable rules (e.g.,
          security constraints) and inject them safely without string concatenation spaghetti.
        </li>
        <li>
          <strong>Validation:</strong> Intercept missing variables or conflicting formats{' '}
          <em>before</em> making expensive network requests to OpenAI or Anthropic.
        </li>
        <li>
          <strong>Optimization:</strong> Our heuristic optimizer mathematically strips filler words
          and deduplicates rules, directly translating to lower API bills and faster response times.
        </li>
      </ul>

      <h2 id="installation" className="text-2xl font-bold mt-12 mb-4">
        Installation
      </h2>
      <p className="mb-4">Install the core builder package via pnpm:</p>
      <CodeBlock code={`pnpm add @promptforgee/core`} colorClass="text-cyan-400" />

      <h2 id="api-reference" className="text-2xl font-bold mt-12 mb-4">
        API Reference
      </h2>
      <h3 id="core" className="text-xl font-semibold mt-8 mb-4">
        @promptforgee/core
      </h3>
      <p className="mb-4">
        The core package exports the `PromptBuilder` which uses a fluent API to construct prompts
        immutably.
      </p>
      <CodeBlock
        code={`import { Prompt } from '@promptforgee/core';

const prompt = Prompt.create()
  .role('Expert Developer')
  .task('Write a React component')
  .constraint('Use Tailwind CSS')
  .build();`}
      />

      <h3 id="analyzer" className="text-xl font-semibold mt-8 mb-4">
        @promptforgee/analyzer
      </h3>
      <p className="mb-4">Evaluate your prompts programmatically before sending them to an LLM.</p>
      <CodeBlock
        code={`import { analyzePrompt } from '@promptforgee/analyzer';

const report = await analyzePrompt("Write code.");
console.log(report.overallScore); // 45
console.log(report.weaknesses); // ["Missing constraints", "Missing format"]`}
      />

      <h3 id="optimizer" className="text-xl font-semibold mt-8 mb-4">
        @promptforgee/optimizer
      </h3>
      <p className="mb-4">
        Automatically rewrite your prompts to save tokens and strengthen logic.
      </p>
      <CodeBlock
        code={`import { optimizePrompt } from '@promptforgee/optimizer';

// Strips "Please", deduplicates contexts, and prefixes weak constraints with "MUST:"
const clean = await optimizePrompt(dirtyPrompt);`}
      />

      <h3 id="registry" className="text-xl font-semibold mt-8 mb-4">
        @promptforgee/registry
      </h3>
      <p className="mb-4">A powerful local registry to save, version, and tag your prompts.</p>
      <CodeBlock
        code={`import { LocalRegistryAdapter } from '@promptforgee/registry';

const registry = new LocalRegistryAdapter('./prompts');
await registry.save('security-review', promptState, { version: '1.0.0', tags: ['security'] });`}
      />

      <h3 id="cli" className="text-xl font-semibold mt-8 mb-4">
        @promptforgee/cli
      </h3>
      <p className="mb-4">
        The command-line interface for managing and testing your prompts right from your terminal.
      </p>
      <CodeBlock
        code={`npx promptforge analyze ./prompts/my-prompt.json
npx promptforge optimize ./prompts/my-prompt.json`}
        colorClass="text-cyan-400"
      />

      <h3 id="templates" className="text-xl font-semibold mt-8 mb-4">
        @promptforgee/templates
      </h3>
      <p className="mb-4">
        A collection of battle-tested, pre-built prompt templates for common AI use cases.
      </p>
      <CodeBlock
        code={`import { createCodeReviewer } from '@promptforgee/templates';

const prompt = createCodeReviewer('TypeScript');`}
      />
    </div>
  );
}
