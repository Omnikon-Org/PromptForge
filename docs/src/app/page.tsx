/* eslint-disable */
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  RefreshCw,
  BarChart,
  Code2,
  Layers,
  Zap,
  Puzzle,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)] bg-[#050608] bg-plus-pattern overflow-hidden">
      {/* Left Sidebar Fixed Decoration */}
      <div className="hidden xl:flex absolute left-0 top-0 bottom-0 w-16 border-r border-white/[0.04] flex-col items-center py-12 justify-between z-10 font-mono text-[#9CA3AF] text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <div className="writing-vertical-rl rotate-180 tracking-[0.2em] opacity-60">v1.0.0</div>
        </div>
        <div className="flex flex-col items-center gap-8 opacity-40">
          <span>01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
        </div>
        <div className="writing-vertical-rl rotate-180 tracking-[0.2em] opacity-40">
          ENGINEER BETTER AI
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:pl-32 xl:pr-12 pt-24 pb-32 flex flex-col lg:flex-row gap-16 lg:gap-8 items-center z-10">
        {/* Left Side: Copy */}
        <div className="flex-1 max-w-2xl animate-fade-up">
          <div className="flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.2em] text-[#9CA3AF] mb-8 uppercase">
            <span>Open Source</span>
            <span className="w-1 h-1 rounded-full bg-[#22C55E]/50" />
            <span>Type-Safe</span>
            <span className="w-1 h-1 rounded-full bg-[#22C55E]/50" />
            <span>Composable</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05] text-white">
            Engineer <br />
            Better <br />
            <span className="text-[#3B82F6]">AI Prompts</span>
          </h1>

          <p className="text-xl text-[#9CA3AF] mb-12 max-w-lg leading-relaxed">
            PromptForge helps developers build, validate, optimize, and manage prompts with a
            powerful, type-safe toolkit.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <Link
              href="/docs"
              className="group flex items-center justify-center gap-2 h-12 px-6 rounded border border-white/[0.15] bg-transparent text-white font-mono text-sm hover:border-[#22C55E]/50 hover:bg-[#22C55E]/5 transition-all"
            >
              Get Started{' '}
              <ArrowRight className="w-4 h-4 text-[#22C55E] transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/studio"
              className="group flex items-center gap-2 text-sm font-mono text-[#9CA3AF] hover:text-white transition-colors"
            >
              Open Studio{' '}
              <ArrowRight className="w-4 h-4 opacity-50 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Side: Code Editor */}
        <div className="flex-1 w-full max-w-3xl animate-fade-up-delay-1 relative">
          <div className="bg-[#0B0D11] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-[#050608]/50">
              <div className="flex items-center gap-2">
                <div className="px-1.5 py-0.5 rounded border border-white/[0.1] text-[10px] font-mono text-[#9CA3AF]">
                  TS
                </div>
                <span className="text-xs font-mono text-[#9CA3AF]">explain-concept.prompt.ts</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-mono text-[#9CA3AF] hover:text-white transition-colors group">
                Run <Play className="w-3 h-3 group-hover:text-[#22C55E]" />
              </button>
            </div>

            {/* Editor Body */}
            <div className="p-6 overflow-x-auto text-sm font-mono leading-loose flex">
              <div className="flex flex-col text-[#9CA3AF]/40 text-right pr-6 select-none border-r border-white/[0.04] mr-6">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <pre className="text-[#ABB2BF] bg-transparent p-0 m-0">
                <span className="token keyword">import</span> {'{'} pf {'}'}{' '}
                <span className="token keyword">from</span>{' '}
                <span className="token string">'promptforge'</span>
                <br />
                <span className="token keyword">import</span> {'{'} z {'}'}{' '}
                <span className="token keyword">from</span>{' '}
                <span className="token string">'promptforge/schema'</span>
                <br />
                <br />
                <span className="token keyword">export const</span>{' '}
                <span className="token function">explainConcept</span>{' '}
                <span className="token operator">=</span> pf.
                <span className="token function">define</span>({'{'}
                <br />
                &nbsp;&nbsp;<span className="token property">input</span>
                <span className="token operator">:</span> z.
                <span className="token function">object</span>({'{'}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;concept<span className="token operator">:</span> z.
                <span className="token function">string</span>().
                <span className="token function">min</span>(<span className="token string">1</span>
                ),
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;audience<span className="token operator">:</span> z.
                <span className="token function">enum</span>([
                <span className="token string">'child'</span>,{' '}
                <span className="token string">'expert'</span>]),
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;context<span className="token operator">:</span> z.
                <span className="token function">string</span>().
                <span className="token function">optional</span>()
                <br />
                &nbsp;&nbsp;{'}'}),
                <br />
                &nbsp;&nbsp;<span className="token property">output</span>
                <span className="token operator">:</span> z.
                <span className="token function">object</span>({'{'}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;explanation<span className="token operator">:</span> z.
                <span className="token function">string</span>(),
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;confidence<span className="token operator">:</span> z.
                <span className="token function">number</span>().
                <span className="token function">min</span>(<span className="token string">0</span>
                ).<span className="token function">max</span>(
                <span className="token string">1</span>)<br />
                &nbsp;&nbsp;{'}'}),
                <br />
                &nbsp;&nbsp;<span className="token property">messages</span>
                <span className="token operator">:</span> (vars){' '}
                <span className="token keyword">=&gt;</span> [<br />
                &nbsp;&nbsp;&nbsp;&nbsp;pf.<span className="token function">system</span>
                <span className="token string">`You are an elite tutor.`</span>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;pf.<span className="token function">user</span>
                <span className="token string">`Explain the concept of: </span>
                <span className="token operator">{'${'}</span>vars.concept
                <span className="token operator">{'}'}</span>
                <span className="token string">`</span>
                <br />
                &nbsp;&nbsp;]
                <br />
                {'}'})
              </pre>
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.04] bg-[#050608]/30 font-mono text-xs">
              <div className="flex gap-8">
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Type-safe
                </div>
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Validated
                </div>
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <RefreshCw className="w-3.5 h-3.5" /> Optimized
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                128 tokens <BarChart className="w-3.5 h-3.5 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developed By Omnikon Banner */}
      <section className="py-12 border-t border-[#111] bg-[#080a0f]">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <p className="text-sm font-medium text-[#737373] uppercase tracking-widest mb-6 font-mono">
            A premium tool developed by
          </p>
          <a
            href="https://github.com/Omnikon-Org"
            target="_blank"
            className="flex items-center gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <img
              src="https://github.com/Omnikon-Org.png"
              width={40}
              height={40}
              alt="Omnikon"
              className="rounded-md"
            />
            <span className="text-2xl font-bold text-white tracking-wide font-mono">OMNIKON</span>
          </a>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <div className="border-t border-white/[0.04] bg-[#050608] relative z-10 w-full py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:pl-32 xl:pr-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* The Problem */}
            <div className="flex flex-col">
              <div className="text-[#7F1D1D] font-mono text-xs font-bold tracking-[0.2em] mb-4">
                THE ISSUE
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                String Concatenation Spaghetti.
              </h2>
              <p className="text-[#9CA3AF] leading-relaxed mb-8">
                Currently, most developers build AI prompts using massive, messy string templates.
                This approach is highly problematic in production environments:
              </p>
              <ul className="space-y-4 font-mono text-sm">
                <li className="flex gap-4">
                  <span className="text-[#7F1D1D] mt-0.5">01</span>
                  <div className="text-[#9CA3AF]">
                    <strong className="text-white block mb-1 font-sans text-base">
                      No Type Safety
                    </strong>
                    It is easy to forget a variable or inject a malformed object, confusing the LLM.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#7F1D1D] mt-0.5">02</span>
                  <div className="text-[#9CA3AF]">
                    <strong className="text-white block mb-1 font-sans text-base">
                      Token Bloat
                    </strong>
                    Developers repeat rules across prompts. The LLM processes "filler words" and
                    duplicate constraints, wasting tokens and driving up API costs.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#7F1D1D] mt-0.5">03</span>
                  <div className="text-[#9CA3AF]">
                    <strong className="text-white block mb-1 font-sans text-base">
                      Hard to Scale
                    </strong>
                    You cannot easily swap out parts of a string or share logic across a massive
                    codebase safely.
                  </div>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="flex flex-col">
              <div className="text-[#22C55E] font-mono text-xs font-bold tracking-[0.2em] mb-4">
                THE USE CASE
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Real Software Engineering.
              </h2>
              <p className="text-[#9CA3AF] leading-relaxed mb-8">
                PromptForge solves these issues by treating prompt engineering as software
                engineering, providing a production-ready toolkit:
              </p>
              <ul className="space-y-4 font-mono text-sm">
                <li className="flex gap-4">
                  <span className="text-[#22C55E] mt-0.5">01</span>
                  <div className="text-[#9CA3AF]">
                    <strong className="text-white block mb-1 font-sans text-base">
                      Immutability & Composability
                    </strong>
                    Build libraries of reusable rules (e.g., security constraints) and inject them
                    safely without string concatenation.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#22C55E] mt-0.5">02</span>
                  <div className="text-[#9CA3AF]">
                    <strong className="text-white block mb-1 font-sans text-base">
                      Pre-Flight Validation
                    </strong>
                    Intercept missing variables or conflicting formats <em>before</em> making
                    expensive network requests.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#22C55E] mt-0.5">03</span>
                  <div className="text-[#9CA3AF]">
                    <strong className="text-white block mb-1 font-sans text-base">
                      Heuristic Optimization
                    </strong>
                    Our optimizer mathematically strips filler words and deduplicates rules,
                    lowering API bills and latency.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="border-t border-white/[0.04] bg-[#0B0D11]/50 relative z-10 w-full mt-auto">
        <div className="max-w-[1400px] mx-auto xl:pl-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
            <div className="p-10 flex flex-col gap-6 group hover:bg-white/[0.01] transition-colors">
              <div className="w-10 h-10 border border-white/[0.08] rounded flex items-center justify-center text-[#22C55E]">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Type-Safe by Default</h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  Define inputs and outputs with Zod for end-to-end type safety.
                </p>
              </div>
            </div>

            <div className="p-10 flex flex-col gap-6 group hover:bg-white/[0.01] transition-colors">
              <div className="w-10 h-10 border border-white/[0.08] rounded flex items-center justify-center text-[#22C55E]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Composable Prompts</h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  Compose reusable blocks and nest prompts with ease.
                </p>
              </div>
            </div>

            <div className="p-10 flex flex-col gap-6 group hover:bg-white/[0.01] transition-colors">
              <div className="w-10 h-10 border border-white/[0.08] rounded flex items-center justify-center text-[#22C55E]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Smart Optimization</h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  Reduce tokens, improve clarity, and strengthen instructions.
                </p>
              </div>
            </div>

            <div className="p-10 flex flex-col gap-6 group hover:bg-white/[0.01] transition-colors">
              <div className="w-10 h-10 border border-white/[0.08] rounded flex items-center justify-center text-[#22C55E]">
                <Puzzle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Seamless Integrations</h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  Export to OpenAI, Anthropic, Gemini, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLI Tool Section */}
      <section className="py-24 bg-[#050608] border-t border-white/[0.04]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Command Line Mastery</h2>
            <p className="text-[#9CA3AF] text-lg">
              Validate, analyze, and optimize your prompts directly from your terminal using the
              PromptForge CLI.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-[#0B0D11] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04] bg-[#050608]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
              </div>
              <span className="text-xs font-mono text-[#9CA3AF] ml-2">Terminal</span>
            </div>
            <div className="p-6 font-mono text-sm overflow-x-auto">
              <div className="text-white/60 mb-2">$ promptforge analyze src/prompts/email.ts</div>
              <div className="text-[#22C55E] mb-1">
                ✓ Analyzed src/prompts/email.ts (152 tokens)
              </div>
              <div className="text-[#3B82F6] mb-1">
                ℹ Insight: Context variable 'user_name' is defined but unused.
              </div>
              <div className="text-white/60 mb-4"></div>
              <div className="text-white/60 mb-2">$ promptforge optimize src/prompts/email.ts</div>
              <div className="text-[#22C55E] mb-1">✓ Optimization complete!</div>
              <div className="text-white mb-1">Tokens reduced: 152 ➔ 114 (25% reduction)</div>
              <div className="text-[#9CA3AF]">
                Removed redundant instruction: "Make sure to output valid JSON" (Schema handles
                this).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 bg-[#080a0f] border-t border-white/[0.04]">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            The PromptForge Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-[#0B0D11] border border-white/[0.04] hover:border-[#22C55E]/30 transition-colors">
              <div className="font-mono text-sm text-[#22C55E] mb-2">@promptforgee/core</div>
              <h3 className="font-semibold text-white mb-2">Core SDK</h3>
              <p className="text-[#9CA3AF] text-sm">
                The primary builder API. Create schemas, compose messages, and validate
                configurations in TypeScript.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B0D11] border border-white/[0.04] hover:border-[#22C55E]/30 transition-colors">
              <div className="font-mono text-sm text-[#22C55E] mb-2">@promptforgee/cli</div>
              <h3 className="font-semibold text-white mb-2">CLI Toolkit</h3>
              <p className="text-[#9CA3AF] text-sm">
                Terminal commands to initialize templates, run audits, and analyze files locally.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B0D11] border border-white/[0.04] hover:border-[#22C55E]/30 transition-colors">
              <div className="font-mono text-sm text-[#22C55E] mb-2">@promptforgee/analyzer</div>
              <h3 className="font-semibold text-white mb-2">Static Analysis</h3>
              <p className="text-[#9CA3AF] text-sm">
                Validates variable interpolation, detects hallucination risks, and ensures
                structural integrity.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B0D11] border border-white/[0.04] hover:border-[#22C55E]/30 transition-colors">
              <div className="font-mono text-sm text-[#22C55E] mb-2">@promptforgee/optimizer</div>
              <h3 className="font-semibold text-white mb-2">Heuristic Engine</h3>
              <p className="text-[#9CA3AF] text-sm">
                Mathematically reduces token bloat by stripping filler words and deduplicating
                constraints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Omnikon Ecosystem */}
      <section className="py-24 bg-[#050608] border-t border-white/[0.04]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold text-white mb-4">The Omnikon Ecosystem</h2>
              <p className="text-[#9CA3AF] text-lg mb-6">
                PromptForge is part of a broader suite of professional developer tools built by
                Omnikon, designed for resilience and productivity.
              </p>
              <a
                href="https://github.com/Omnikon-Org"
                target="_blank"
                className="inline-flex items-center h-10 px-4 rounded border border-white/[0.15] text-sm font-mono text-white hover:bg-white/[0.05] transition-colors"
              >
                View all projects <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="md:w-5/12 flex flex-col gap-4 w-full">
              <a
                target="_blank"
                href="https://pack-vault-website.vercel.app/"
                className="p-4 rounded-xl border border-white/[0.08] bg-[#0B0D11] hover:border-white/[0.2] transition-colors flex items-center justify-between group"
              >
                <div className="font-semibold text-white transition-colors">PackVault</div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                target="_blank"
                href="https://github.com/Omnikon-Org/IssueSwipe"
                className="p-4 rounded-xl border border-white/[0.08] bg-[#0B0D11] hover:border-white/[0.2] transition-colors flex items-center justify-between group"
              >
                <div className="font-semibold text-white transition-colors">IssueSwipe</div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                target="_blank"
                href="https://github.com/Omnikon-Org/Abyss"
                className="p-4 rounded-xl border border-white/[0.08] bg-[#0B0D11] hover:border-white/[0.2] transition-colors flex items-center justify-between group"
              >
                <div className="font-semibold text-white transition-colors">Abyss</div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                target="_blank"
                href="https://github.com/Omnikon-Org/schema-cast"
                className="p-4 rounded-xl border border-white/[0.08] bg-[#0B0D11] hover:border-white/[0.2] transition-colors flex items-center justify-between group"
              >
                <div className="font-semibold text-white transition-colors">schema-cast</div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#080a0f] border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#22C55E]/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Engineer Better Prompts?
          </h2>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-10">
            Install the core toolkit today and bring type safety to your AI pipeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center font-medium h-12 px-8 rounded bg-[#22C55E] hover:bg-[#16a34a] text-[#050608] transition-colors"
            >
              Read the Docs
            </Link>
            <div className="flex items-center px-4 py-2 rounded border border-white/[0.15] bg-[#050608]">
              <code className="text-white font-mono mr-4 text-sm">
                npm install @promptforgee/core
              </code>
              <div className="w-4 h-4 text-[#9CA3AF]">
                {/* Visual copy icon placeholder */}
                <Code2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.04] bg-[#050608]">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* PF Logo Lockup */}
            <div className="flex items-center gap-2">
              <Image
                src="/PromptForgeLogo.png"
                alt="PromptForge Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col justify-center mt-0.5">
                <div className="text-lg font-bold tracking-[0.2em] flex items-center leading-none mb-1">
                  <span className="text-white">PROMPT</span>
                  <span className="text-[#22C55E]">FORGE</span>
                </div>
                <span className="text-[8px] text-[#9CA3AF] tracking-[0.3em] leading-none uppercase">
                  Engineer Better AI Prompts
                </span>
              </div>
            </div>
            <div className="flex gap-6 font-mono text-sm text-[#9CA3AF]">
              <Link href="/docs" className="hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/studio" className="hover:text-white transition-colors">
                Studio
              </Link>
              <Link
                href="https://github.com/promptforge/promptforge"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center md:text-left text-xs font-mono text-[#9CA3AF]/60">
            © {new Date().getFullYear()} Omnikon. Open Source under MIT License.
          </div>
        </div>
      </footer>
    </div>
  );
}
