'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Terminal,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Code2,
  Activity,
  Copy,
  Package,
  RefreshCw,
  Check,
} from 'lucide-react';
import { useState } from 'react';

// --- Reusable Components ---
const CopyInstall = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText('npm install @promptforgee/core');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-3 bg-[#0B0D11] border border-white/[0.08] hover:border-white/[0.2] transition-colors rounded px-4 py-3 text-sm font-mono text-white/90 group"
    >
      <span className="text-gray-500">$</span> npm install @promptforgee/core
      {copied ? (
        <Check className="w-4 h-4 text-green-500 ml-2" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors ml-2" />
      )}
    </button>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050608] text-[#9CA3AF] font-sans selection:bg-[#3B82F6] selection:text-white">
      <main className="flex flex-col items-center overflow-hidden">
        {/* ==================================================== */}
        {/* HERO SECTION                                         */}
        {/* ==================================================== */}
        <section className="w-full max-w-6xl px-6 pt-32 pb-24 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
          >
            Write Prompts Like Code.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mb-12"
          >
            Build type-safe, composable, production-ready prompts with TypeScript. Replace fragile
            string templates with a modern developer workflow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-24"
          >
            <Link
              href="/studio"
              className="bg-[#3B82F6] hover:bg-blue-500 text-white px-8 py-3.5 rounded font-semibold transition-colors flex items-center gap-2"
            >
              Open Studio <ArrowRight className="w-4 h-4" />
            </Link>
            <CopyInstall />
          </motion.div>

          {/* Hero Visual: Live Workflow */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-[#0B0D11] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-left font-mono text-xs"
          >
            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/[0.08]">
              <div className="text-white/40 mb-4 uppercase tracking-wider font-bold">
                1. Fragile String
              </div>
              <pre className="text-red-400 opacity-80 leading-relaxed">
                {`const prompt = 
  "You are a helpful assistant\\n" +
  "Context: " + data.context + "\\n" +
  "User: " + req.query; // Breaks easily`}
              </pre>
            </div>
            <div className="flex-1 p-6 bg-[#0D1017]">
              <div className="text-white/40 mb-4 uppercase tracking-wider font-bold">
                2. Type-Safe API
              </div>
              <pre className="text-green-400 leading-relaxed">
                {`const prompt = pf.define({
  role: 'helpful assistant',
  context: data.context,
  task: req.query
}); // Compiled & Validated`}
              </pre>
            </div>
          </motion.div>
        </section>

        {/* ==================================================== */}
        {/* SECTION 1: THE PROBLEM                               */}
        {/* ==================================================== */}
        <section className="w-full max-w-6xl px-6 py-24 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                String concatenation does not scale.
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                As your AI features grow, managing large prompt templates with string interpolation
                becomes a maintenance nightmare. Unescaped characters break JSON outputs, context
                gets duplicated, and refactoring is impossible.
              </p>
              <p className="text-white/60 leading-relaxed">
                PromptForge replaces template literals with a structured, strongly-typed compiler
                designed specifically for Large Language Models.
              </p>
            </div>
            <div className="bg-[#0B0D11] border border-white/[0.08] rounded-lg p-6 font-mono text-xs leading-loose relative">
              <div className="absolute top-4 right-4 text-red-500/50">
                <XCircle className="w-6 h-6" />
              </div>
              <span className="text-[#F59E0B]">const</span>{' '}
              <span className="text-[#3B82F6]">systemPrompt</span> ={' '}
              <span className="text-[#22C55E]">{'`'}</span>
              <br />
              <span className="text-[#22C55E]">You are an expert financial analyst.</span>
              <br />
              <span className="text-[#22C55E]">Here is the user's portfolio data:</span>
              <br />
              <span className="text-[#3B82F6]">{'${'}</span>JSON.
              <span className="text-[#3B82F6]">stringify</span>(userData)
              <span className="text-[#3B82F6]">{'}'}</span>
              <br />
              <span className="text-[#22C55E]">
                Please return a JSON array of... wait what if userData contains quotes?
              </span>
              <br />
              <span className="text-[#22C55E]">{'`;'}</span>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* SECTION 2: WHY PROMPTFORGE (Comparison)              */}
        {/* ==================================================== */}
        <section className="w-full max-w-4xl px-6 py-24">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why PromptForge?</h2>
          <div className="border border-white/[0.08] rounded-lg overflow-hidden bg-[#0B0D11]">
            <div className="grid grid-cols-2 text-sm font-semibold text-white/40 border-b border-white/[0.08] bg-[#050608]">
              <div className="p-4 border-r border-white/[0.08]">Without PromptForge</div>
              <div className="p-4 text-white">With PromptForge</div>
            </div>
            <div className="grid grid-cols-2 text-sm border-b border-white/[0.04]">
              <div className="p-4 border-r border-white/[0.08] text-red-400/80 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Manual Strings
              </div>
              <div className="p-4 text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Type-safe API
              </div>
            </div>
            <div className="grid grid-cols-2 text-sm border-b border-white/[0.04]">
              <div className="p-4 border-r border-white/[0.08] text-red-400/80 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> No Validation
              </div>
              <div className="p-4 text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Compile-time Validation
              </div>
            </div>
            <div className="grid grid-cols-2 text-sm border-b border-white/[0.04]">
              <div className="p-4 border-r border-white/[0.08] text-red-400/80 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Provider-specific formatting
              </div>
              <div className="p-4 text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Provider Agnostic Compilation
              </div>
            </div>
            <div className="grid grid-cols-2 text-sm">
              <div className="p-4 border-r border-white/[0.08] text-red-400/80 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Difficult Maintenance
              </div>
              <div className="p-4 text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Composable Prompts
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* SECTION 4: PROMPT PIPELINE                           */}
        {/* ==================================================== */}
        <section className="w-full max-w-6xl px-6 py-24 border-t border-white/[0.04] flex flex-col items-center">
          <h2 className="text-3xl font-bold text-white mb-16">The Prompt Pipeline</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-mono text-white/80">
            <div className="px-4 py-2 border border-white/[0.08] rounded bg-[#0B0D11]">Write</div>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <div className="px-4 py-2 border border-white/[0.08] rounded bg-[#0B0D11]">Compile</div>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <div className="px-4 py-2 border border-[#3B82F6]/50 rounded bg-[#3B82F6]/10 text-[#3B82F6]">
              Validate
            </div>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <div className="px-4 py-2 border border-white/[0.08] rounded bg-[#0B0D11]">Analyze</div>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <div className="px-4 py-2 border border-white/[0.08] rounded bg-[#0B0D11]">
              Optimize
            </div>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <div className="px-4 py-2 border border-[#22C55E]/50 rounded bg-[#22C55E]/10 text-[#22C55E]">
              Deploy
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* SECTION 5: CODE FIRST                                */}
        {/* ==================================================== */}
        <section className="w-full max-w-6xl px-6 py-24 border-t border-white/[0.04]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Code First.</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Define your inputs, outputs, and constraints using Zod schemas. PromptForge handles
              the markdown generation and LLM formatting automatically.
            </p>
          </div>

          <div className="bg-[#0B0D11] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[500px]">
            <div className="flex-1 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col">
              <div className="h-10 border-b border-white/[0.08] bg-[#050608] flex items-center px-4 gap-2 text-xs font-mono text-white/40">
                <Code2 className="w-4 h-4 text-[#3B82F6]" /> agent.ts
              </div>
              <div className="p-4 font-mono text-xs overflow-y-auto leading-relaxed">
                <span className="text-[#F59E0B]">import</span> {'{ pf }'}{' '}
                <span className="text-[#F59E0B]">from</span>{' '}
                <span className="text-[#22C55E]">'@promptforgee/core'</span>;
                <br />
                <br />
                <span className="text-[#F59E0B]">export const</span> summarize = pf.
                <span className="text-[#3B82F6]">define</span>({'{'}
                <br />
                {'  '}input: z.<span className="text-[#3B82F6]">object</span>({'{'} text: z.string(){' '}
                {'}'}),
                <br />
                {'  '}output: z.<span className="text-[#3B82F6]">object</span>({'{'}
                <br />
                {'    '}summary: z.string(),
                <br />
                {'    '}keywords: z.array(z.string())
                <br />
                {'  }'}),
                <br />
                {'  '}messages: (vars) =&gt; [<br />
                {'    '}pf.<span className="text-[#3B82F6]">system</span>
                <span className="text-[#22C55E]">{'`You are a strict technical summarizer.`'}</span>
                ,<br />
                {'    '}pf.<span className="text-[#3B82F6]">user</span>
                <span className="text-[#22C55E]">{'`Summarize this: ${vars.text}`'}</span>
                <br />
                {'  '}]<br />
                {'}'});
              </div>
            </div>

            <div className="flex-1 bg-[#050608] flex flex-col">
              <div className="h-10 border-b border-white/[0.08] flex items-center px-4 gap-6 text-xs font-mono font-bold tracking-wider">
                <span className="text-white">COMPILED</span>
                <span className="text-white/40">OPENAI</span>
                <span className="text-white/40">ANTHROPIC</span>
              </div>
              <div className="p-4 font-mono text-xs overflow-y-auto leading-relaxed text-white/80">
                SYSTEM: You are a strict technical summarizer.
                <br />
                <br />
                USER: Summarize this: {'{vars.text}'}
                <br />
                <br />
                OUTPUT FORMAT:
                <br />
                {`{
  "summary": "string",
  "keywords": ["string"]
}`}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* SECTION 6 & 7: ANALYZER & OPTIMIZER                  */}
        {/* ==================================================== */}
        <section className="w-full max-w-6xl px-6 py-24 border-t border-white/[0.04] grid md:grid-cols-2 gap-8">
          <div className="bg-[#0B0D11] border border-white/[0.08] rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-[#3B82F6]" />
              <h2 className="text-xl font-bold text-white">Analyzer</h2>
            </div>
            <p className="text-white/60 mb-8 text-sm">
              Static analysis and real LLM evaluation grades your prompts before they hit
              production.
            </p>

            <div className="flex items-end gap-6 border-t border-white/[0.08] pt-6">
              <div>
                <div className="text-xs font-mono text-white/40 mb-1">SCORE</div>
                <div className="text-4xl font-bold text-[#22C55E]">95/100</div>
              </div>
              <div>
                <div className="text-xs font-mono text-white/40 mb-1">TOKENS</div>
                <div className="text-2xl font-mono text-white">124</div>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22C55E]" /> Perfect task isolation
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22C55E]" /> Structured output enforced
              </div>
            </div>
          </div>

          <div className="bg-[#0B0D11] border border-white/[0.08] rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="w-6 h-6 text-[#22C55E]" />
              <h2 className="text-xl font-bold text-white">Optimizer</h2>
            </div>
            <p className="text-white/60 mb-8 text-sm">
              Run your code through the optimizer to strip filler words and strictly enforce prompt
              engineering best practices.
            </p>

            <div className="space-y-4">
              <div className="border border-white/[0.08] rounded p-3 bg-[#050608]">
                <div className="text-xs font-mono text-white/40 mb-1">BEFORE</div>
                <div className="text-sm text-red-400/80">
                  "Please somehow summarize this stuff if you can..."
                </div>
              </div>
              <div className="border border-[#22C55E]/20 rounded p-3 bg-[#22C55E]/5">
                <div className="text-xs font-mono text-[#22C55E] mb-1">AFTER</div>
                <div className="text-sm text-[#22C55E]">"Summarize the provided text."</div>
              </div>
              <div className="pt-2 text-xs font-mono text-white/40 flex justify-between">
                <span>Saved: 24% Tokens</span>
                <span>Removed Ambiguity</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* SECTION 8: REAL EXAMPLES                             */}
        {/* ==================================================== */}
        <section className="w-full max-w-6xl px-6 py-24 border-t border-white/[0.04]">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Production Ready Examples
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'RAG Pipeline',
              'Agentic Loop',
              'Summarization',
              'Security Audit',
              'SQL Generator',
              'Data Extraction',
              'Classification',
              'Code Review',
            ].map((ex, i) => (
              <Link
                href="/studio"
                key={i}
                className="bg-[#0B0D11] border border-white/[0.08] hover:border-white/[0.2] transition-colors rounded p-4 flex items-center justify-between group"
              >
                <span className="text-sm font-semibold text-white/80">{ex}</span>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/studio"
              className="text-sm text-[#3B82F6] hover:text-blue-400 font-semibold transition-colors"
            >
              Load these directly into Studio &rarr;
            </Link>
          </div>
        </section>

        {/* ==================================================== */}
        {/* SECTION 10 & 11: DX & SOCIAL PROOF                   */}
        {/* ==================================================== */}
        <section className="w-full bg-[#0B0D11] border-t border-white/[0.04] py-24 mt-12">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Developer Experience First.</h2>
              <ul className="space-y-4 font-mono text-sm text-white/70">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" /> TypeScript First
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" /> Tree Shakeable
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" /> ESM & CommonJS
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" /> Zero Dependencies (Core)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" /> Provider Agnostic
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Open Source & Community.</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://github.com/Omnikon-Org/PromptForge"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-1 p-4 border border-white/[0.08] rounded hover:border-white/[0.2] transition-colors bg-[#050608]"
                >
                  <Code2 className="w-5 h-5 text-white/60 mb-2" />
                  <span className="text-lg font-bold text-white">GitHub</span>
                  <span className="text-xs text-white/40 font-mono">MIT License</span>
                </a>
                <a
                  href="https://www.npmjs.com/package/@promptforgee/core"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-1 p-4 border border-white/[0.08] rounded hover:border-white/[0.2] transition-colors bg-[#050608]"
                >
                  <Package className="w-5 h-5 text-white/60 mb-2" />
                  <span className="text-lg font-bold text-white">npm</span>
                  <span className="text-xs text-white/40 font-mono">Latest Version</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* FINAL CTA                                            */}
        {/* ==================================================== */}
        <section className="w-full max-w-4xl mx-auto px-6 py-32 text-center flex flex-col items-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to standardize your prompts?</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/studio"
              className="bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded font-semibold transition-colors flex items-center gap-2"
            >
              Open Studio <ArrowRight className="w-4 h-4" />
            </Link>
            <CopyInstall />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.04] bg-[#030406] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold tracking-tight">
            <Terminal className="w-5 h-5 text-[#3B82F6]" /> PromptForge
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/studio" className="hover:text-white transition-colors">
              Studio
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Documentation
            </Link>
            <Link
              href="https://github.com/Omnikon-Org/PromptForge"
              className="hover:text-white transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://www.npmjs.com/package/@promptforgee/core"
              className="hover:text-white transition-colors"
            >
              npm
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
