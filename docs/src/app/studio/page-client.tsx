/* eslint-disable */
'use client';

import { useEffect } from 'react';
import { Prompt } from '@promptforgee/core';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { HfInference } from '@huggingface/inference';
import {
  Play,
  Share,
  Download,
  Save,
  Settings,
  Folder,
  Layers,
  Clock,
  Star,
  Terminal,
  AlertCircle,
  Activity,
  RefreshCw,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Code2,
  Database,
  MessageSquare,
  Box,
  Key,
  FileText,
  Search,
  BookOpen,
  Copy,
} from 'lucide-react';
import { useStudioStore, StudioCommand } from '@/store/studioStore';
import { CommandPalette } from '@/components/CommandPalette';

export default function StudioPageClient() {
  const store = useStudioStore();

  // --- Auto-compile builder state ---
  useEffect(() => {
    if (store.mode === 'builder') {
      try {
        let p = Prompt.create().role(store.role).task(store.task);
        if (store.format) p = p.output(store.format);
        store.contexts.forEach((c) => {
          if (c) p = p.context(c);
        });
        store.constraints.forEach((c) => {
          if (c) p = p.constraint(c);
        });
        store.examples.forEach((e) => {
          if (e.input && e.output) p = p.example(e.input, e.output);
        });
        store.setCompiled(p.build());
      } catch (e) {
        store.setCompiled('Error compiling visual prompt.');
      }
    } else if (store.mode === 'code') {
      store.setCompiled(
        `SYSTEM: You are an elite application security engineer.\nUSER: Review the following \${vars.language} code for security vulnerabilities.\nCode:\n\${vars.code}\n\nOUTPUT FORMAT:\n{\n  "vulnerabilities": [\n    {\n      "type": "string",\n      "severity": "string",\n      "line": 0\n    }\n  ]\n}`,
      );
    }
  }, [
    store.mode,
    store.role,
    store.task,
    store.format,
    store.contexts,
    store.constraints,
    store.examples,
    store.code,
  ]);

  // --- Register Commands & Handlers ---
  useEffect(() => {
    store.loadRecentActions();

    const builtInCommands: StudioCommand[] = [
      {
        id: 'create',
        title: 'Create Prompt',
        category: 'Actions',
        action: 'prompt.create',
        icon: <Plus className="w-4 h-4" />,
        shortcut: ['meta', 'n'],
      },
      {
        id: 'open',
        title: 'Open Prompt',
        category: 'Actions',
        action: 'prompt.open',
        icon: <Folder className="w-4 h-4" />,
        shortcut: ['meta', 'o'],
      },

      {
        id: 'analyze',
        title: 'Analyze Prompt',
        category: 'Analyze',
        action: 'prompt.analyze',
        icon: <Activity className="w-4 h-4" />,
        keywords: ['health', 'score', 'check'],
        when: (s) => !!s.compiled,
      },
      {
        id: 'optimize',
        title: 'Optimize Prompt',
        category: 'Optimize',
        action: 'prompt.optimize',
        icon: <RefreshCw className="w-4 h-4" />,
        keywords: ['reduce', 'tokens', 'improve'],
        when: (s) => !!s.compiled,
      },
      {
        id: 'compile',
        title: 'Compile Prompt',
        category: 'Actions',
        action: 'prompt.compile',
        icon: <Play className="w-4 h-4" />,
        when: (s) => !!s.compiled,
      },

      {
        id: 'export-json',
        title: 'Export JSON',
        category: 'Export',
        action: 'export.json',
        icon: <Download className="w-4 h-4" />,
        keywords: ['download'],
        when: (s) => !!s.compiled,
      },
      {
        id: 'export-ts',
        title: 'Export TypeScript',
        category: 'Export',
        action: 'export.ts',
        icon: <Code2 className="w-4 h-4" />,
        when: (s) => !!s.compiled,
      },

      {
        id: 'preview-openai',
        title: 'Preview OpenAI',
        category: 'Preview',
        action: 'preview.openai',
        icon: <Terminal className="w-4 h-4" />,
        when: (s) => !!s.compiled,
      },
      {
        id: 'preview-anthropic',
        title: 'Preview Anthropic',
        category: 'Preview',
        action: 'preview.anthropic',
        icon: <Terminal className="w-4 h-4" />,
        aliases: ['claude'],
        when: (s) => !!s.compiled,
      },

      {
        id: 'docs',
        title: 'Search Documentation',
        category: 'Navigation',
        action: 'navigation.docs',
        icon: <BookOpen className="w-4 h-4" />,
        keywords: ['help', 'guide'],
      },
      {
        id: 'settings',
        title: 'Open Settings',
        category: 'Settings',
        action: 'navigation.settings',
        icon: <Settings className="w-4 h-4" />,
        shortcut: ['meta', ','],
      },
      {
        id: 'install',
        title: 'Copy npm Install Command',
        category: 'Actions',
        action: 'action.copyInstall',
        icon: <Copy className="w-4 h-4" />,
      },
      {
        id: 'github',
        title: 'View GitHub Repository',
        category: 'Navigation',
        action: 'navigation.github',
        icon: <Code2 className="w-4 h-4" />,
      },
    ];

    store.registerCommands(builtInCommands);

    store.registerActionHandler('prompt.analyze', async (s, get, set) => {
      if (!s.hfToken) {
        set({ showSettings: true });
        return;
      }
      set({ isAnalyzing: true, bottomTab: 'analyzer', analysisError: '' });
      try {
        const hf = new HfInference(s.hfToken);
        const systemPrompt = `You are a strict Prompt Engineering Evaluator. Analyze the user's prompt. 
Evaluate it out of 100 on Clarity, Task Isolation, and Constraints.
You MUST output ONLY valid JSON in the following format, with no markdown formatting, no code blocks, and no extra text.
{ "score": 85, "strengths": ["string"], "weaknesses": ["string"], "suggestions": ["string"] }`;

        const response = await hf.chatCompletion({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: s.compiled },
          ],
          max_tokens: 500,
          temperature: 0.1,
        });

        let content = response.choices[0].message.content;
        if (!content) throw new Error('Empty response from LLM');
        if (content.includes('\`\`\`'))
          content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
        const data = JSON.parse(content.trim());
        set({ analysisReport: data, score: data.score, tokens: Math.ceil(s.compiled.length / 4) });
      } catch (err) {
        const e = err as Error;
        set({ analysisError: e.message || 'Failed to analyze prompt.' });
      } finally {
        set({ isAnalyzing: false });
      }
    });

    store.registerActionHandler('prompt.optimize', async (s, get, set) => {
      if (!s.hfToken) {
        set({ showSettings: true });
        return;
      }
      set({ isOptimizing: true, bottomTab: 'optimizer', optimizationError: '' });
      try {
        const hf = new HfInference(s.hfToken);
        const systemPrompt = `You are an elite Prompt Optimizer. Your task is to rewrite the user's prompt to make it significantly better, more concise, and highly effective for LLMs.
Remove filler words, strengthen constraints, and structure the prompt cleanly using standard prompt engineering practices.
Return ONLY the rewritten prompt text. Do not wrap in quotes or code blocks unless part of the prompt.`;

        const response = await hf.chatCompletion({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: s.compiled },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        });

        set({ optimizedCode: response.choices[0].message.content || '' });
      } catch (err) {
        const e = err as Error;
        set({ optimizationError: e.message || 'Failed to optimize prompt.' });
      } finally {
        set({ isOptimizing: false });
      }
    });

    store.registerActionHandler('navigation.settings', (s, get, set) =>
      set({ showSettings: true }),
    );
    store.registerActionHandler('preview.openai', (s, get, set) => set({ rightTab: 'openai' }));
    store.registerActionHandler('preview.anthropic', (s, get, set) =>
      set({ rightTab: 'anthropic' }),
    );
    store.registerActionHandler('action.copyInstall', async () => {
      await navigator.clipboard.writeText('npm install @promptforgee/core');
    });
    store.registerActionHandler('navigation.github', () => {
      window.open('https://github.com/Omnikon-Org/PromptForge', '_blank');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnalyze = () => store.dispatchAction('prompt.analyze');
  const handleOptimize = () => store.dispatchAction('prompt.optimize');
  const saveToken = () => {
    store.setAuth((document.getElementById('hfTokenInput') as HTMLInputElement).value);
    store.setShowSettings(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-[#050608] text-[#9CA3AF] font-mono overflow-hidden text-sm">
      <CommandPalette />

      {/* Settings Modal */}
      {store.showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0B0D11] border border-white/[0.08] p-6 rounded-lg w-full max-w-md shadow-2xl">
            <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#3B82F6]" /> Setup LLM Integration
            </h2>
            <p className="text-xs text-[#9CA3AF] mb-4 leading-relaxed">
              PromptForge Studio uses Hugging Face Inference API for real-time analysis and
              optimization. Paste your free Hugging Face Access Token below.
            </p>
            <input
              id="hfTokenInput"
              type="password"
              placeholder="hf_..."
              defaultValue={store.hfToken}
              className="w-full bg-[#050608] border border-white/[0.08] rounded px-3 py-2 mb-4 text-white focus:outline-none focus:border-[#3B82F6]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => store.setShowSettings(false)}
                className="px-4 py-2 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveToken}
                className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-500 text-white text-xs rounded"
              >
                Save Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR (Activity Bar) */}
      <div className="w-12 border-r border-white/[0.04] flex flex-col items-center py-4 gap-6 bg-[#030406]">
        <button className="text-white hover:text-[#22C55E] transition-colors">
          <Folder className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition-colors">
          <Database className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition-colors">
          <Layers className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition-colors">
          <Clock className="w-5 h-5" />
        </button>
        <button
          onClick={() => store.setPaletteOpen(true)}
          className="hover:text-[#3B82F6] transition-colors"
          title="Command Palette (Cmd+K)"
        >
          <Search className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => store.setShowSettings(true)}
          className={`${store.hfToken ? 'text-[#22C55E]' : 'text-yellow-500'} hover:text-white transition-colors`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* EXPLORER (Secondary Sidebar) */}
      <div className="w-56 border-r border-white/[0.04] bg-[#050608] hidden lg:flex flex-col">
        <div className="h-10 border-b border-white/[0.04] flex items-center px-4 text-xs font-bold tracking-wider text-white">
          EXPLORER
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex items-center gap-1 py-1 hover:bg-white/[0.04] cursor-pointer rounded px-2">
            <ChevronDown className="w-3.5 h-3.5" />
            <span className="font-semibold text-white/90">PROJECT</span>
          </div>
          <div className="pl-4 mt-1 space-y-1">
            <div className="flex items-center gap-2 py-1 hover:bg-white/[0.04] cursor-pointer rounded px-2 text-white">
              <Code2 className="w-4 h-4 text-[#3B82F6]" />
              <span className="truncate">analyze-code.ts</span>
            </div>
            <div className="flex items-center gap-2 py-1 hover:bg-white/[0.04] cursor-pointer rounded px-2">
              <Box className="w-4 h-4 text-[#F59E0B]" />
              <span className="truncate">package.json</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN EDITOR COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Tabs & Toolbar */}
        <div className="h-10 border-b border-white/[0.04] flex items-center justify-between bg-[#080A0F] pr-4">
          <div className="flex h-full">
            <button
              onClick={() => store.setMode('builder')}
              className={`h-full px-4 flex items-center gap-2 border-r border-white/[0.04] ${store.mode === 'builder' ? 'bg-[#050608] text-white border-t-2 border-t-[#3B82F6]' : 'hover:bg-white/[0.02]'}`}
            >
              <Box className="w-3.5 h-3.5 text-[#3B82F6]" /> Visual Builder
            </button>
            <button
              onClick={() => store.setMode('code')}
              className={`h-full px-4 flex items-center gap-2 border-r border-white/[0.04] ${store.mode === 'code' ? 'bg-[#050608] text-white border-t-2 border-t-[#F59E0B]' : 'hover:bg-white/[0.02]'}`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#F59E0B]" /> Code Editor
            </button>
          </div>

          {/* Toolbar Actions */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handleAnalyze}
              disabled={store.isAnalyzing}
              className="flex items-center gap-1.5 hover:text-white transition-colors disabled:opacity-50"
            >
              <Activity
                className={`w-3.5 h-3.5 text-blue-400 ${store.isAnalyzing ? 'animate-pulse' : ''}`}
              />{' '}
              Analyze
            </button>
            <button
              onClick={handleOptimize}
              disabled={store.isOptimizing}
              className="flex items-center gap-1.5 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#22C55E] ${store.isOptimizing ? 'animate-spin' : ''}`}
              />{' '}
              Optimize
            </button>
            <div className="w-px h-4 bg-white/[0.08] mx-1" />
            <button
              onClick={() => store.setPaletteOpen(true)}
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
            >
              <Search className="w-3.5 h-3.5" /> Cmd+K
            </button>
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#050608] relative">
          {store.mode === 'code' ? (
            <div className="absolute inset-0 pt-2">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={store.code}
                onChange={(val) => store.setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'var(--font-geist-mono)',
                  padding: { top: 16 },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            </div>
          ) : (
            <div className="p-6 max-w-3xl space-y-6">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Role / Persona
                </label>
                <input
                  type="text"
                  value={store.role}
                  onChange={(e) => store.setBuilderField('role', e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2">Task</label>
                <textarea
                  value={store.task}
                  rows={3}
                  onChange={(e) => store.setBuilderField('task', e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Output Format
                </label>
                <input
                  type="text"
                  value={store.format}
                  onChange={(e) => store.setBuilderField('format', e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors text-white"
                />
              </div>
              <div className="pt-4 border-t border-white/[0.04]">
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Constraints
                </label>
                <div className="space-y-2">
                  {store.constraints.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={c}
                        onChange={(e) => {
                          const n = [...store.constraints];
                          n[i] = e.target.value;
                          store.setBuilderField('constraints', n);
                        }}
                        className="flex-1 bg-[#080A0F] border border-white/[0.08] rounded px-3 py-1.5 focus:outline-none focus:border-[#22C55E] text-white"
                      />
                      <button
                        onClick={() =>
                          store.setBuilderField(
                            'constraints',
                            store.constraints.filter((_, idx) => idx !== i),
                          )
                        }
                        className="px-2 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => store.setBuilderField('constraints', [...store.constraints, ''])}
                    className="text-xs text-[#22C55E] hover:text-[#1eb355] flex items-center gap-1 mt-2"
                  >
                    <Plus className="w-3 h-3" /> Add Constraint
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM PANEL */}
        <div className="h-64 border-t border-white/[0.04] bg-[#050608] flex flex-col">
          <div className="h-9 flex items-center px-4 gap-6 text-[11px] uppercase tracking-wider shrink-0">
            <button
              onClick={() => store.setBottomTab('problems')}
              className={`h-full border-b-2 transition-colors ${store.bottomTab === 'problems' ? 'border-[#3B82F6] text-white' : 'border-transparent hover:text-white'}`}
            >
              Problems
            </button>
            <button
              onClick={() => store.setBottomTab('analyzer')}
              className={`h-full border-b-2 flex items-center gap-1.5 transition-colors ${store.bottomTab === 'analyzer' ? 'border-[#3B82F6] text-white' : 'border-transparent hover:text-white'}`}
            >
              <Activity className="w-3 h-3 text-blue-400" /> Analyzer Metrics
            </button>
            <button
              onClick={() => store.setBottomTab('optimizer')}
              className={`h-full border-b-2 flex items-center gap-1.5 transition-colors ${store.bottomTab === 'optimizer' ? 'border-[#3B82F6] text-white' : 'border-transparent hover:text-white'}`}
            >
              <RefreshCw className="w-3 h-3 text-[#22C55E]" /> Optimizer
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#080A0F]">
            {store.bottomTab === 'problems' && (
              <div className="flex flex-col items-center justify-center h-full text-white/40">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                No syntax problems detected in builder/code.
              </div>
            )}

            {store.bottomTab === 'analyzer' && (
              <div className="flex flex-col gap-4">
                {store.isAnalyzing ? (
                  <div className="text-white/60 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Running Analysis...
                  </div>
                ) : store.analysisError ? (
                  <div className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {store.analysisError}
                  </div>
                ) : store.analysisReport ? (
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 border-r border-white/[0.04] pr-4">
                      <div className="flex items-center gap-8 mb-4">
                        <div>
                          <div className="text-xs text-white/50 mb-1">Score</div>
                          <div
                            className={`text-3xl font-bold flex items-center gap-2 ${store.score !== null && store.score >= 80 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}
                          >
                            {store.score}/100
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50 mb-1">Tokens</div>
                          <div className="text-2xl font-mono text-white">{store.tokens}</div>
                        </div>
                      </div>
                      {store.analysisReport &&
                        Array.isArray((store.analysisReport as any).suggestions) &&
                        (store.analysisReport as any).suggestions.length > 0 && (
                          <div className="text-xs text-[#3B82F6]">
                            <strong className="block mb-1">Suggestions:</strong>
                            <ul className="list-disc pl-4 space-y-1 opacity-80">
                              {store.analysisReport &&
                                Array.isArray((store.analysisReport as any).suggestions) &&
                                (store.analysisReport as any).suggestions.map(
                                  (s: string, i: number) => <li key={i}>{s}</li>,
                                )}
                            </ul>
                          </div>
                        )}
                    </div>
                    <div className="col-span-1 border-r border-white/[0.04] pr-4">
                      <strong className="text-xs text-[#22C55E] block mb-2">Strengths:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-white/80">
                        {store.analysisReport &&
                          Array.isArray((store.analysisReport as any).strengths) &&
                          (store.analysisReport as any).strengths.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="col-span-1">
                      <strong className="text-xs text-red-400 block mb-2">Weaknesses:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-white/80">
                        {store.analysisReport &&
                          Array.isArray((store.analysisReport as any).weaknesses) &&
                          (store.analysisReport as any).weaknesses.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/40 italic flex items-center justify-center h-full">
                    Run command (Cmd+K) "Analyze Prompt" to evaluate
                  </div>
                )}
              </div>
            )}

            {store.bottomTab === 'optimizer' && (
              <div className="flex flex-col gap-2 h-full">
                {store.isOptimizing ? (
                  <div className="text-white/60 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Rewriting prompt...
                  </div>
                ) : store.optimizationError ? (
                  <div className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {store.optimizationError}
                  </div>
                ) : store.optimizedCode ? (
                  <pre className="text-[#22C55E] whitespace-pre-wrap font-mono text-xs leading-relaxed overflow-y-auto">
                    {store.optimizedCode}
                  </pre>
                ) : (
                  <div className="text-white/40 italic flex items-center justify-center h-full">
                    Run command (Cmd+K) "Optimize Prompt" to rewrite
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW PANEL */}
      <div className="w-[450px] border-l border-white/[0.04] bg-[#030406] flex flex-col hidden xl:flex">
        <div className="h-10 border-b border-white/[0.04] flex items-center px-4 gap-4 text-xs font-bold tracking-wider">
          <button
            onClick={() => store.setRightTab('compiled')}
            className={`transition-colors ${store.rightTab === 'compiled' ? 'text-white' : 'hover:text-white'}`}
          >
            COMPILED
          </button>
          <button
            onClick={() => store.setRightTab('openai')}
            className={`transition-colors ${store.rightTab === 'openai' ? 'text-white' : 'hover:text-white'}`}
          >
            OPENAI
          </button>
          <button
            onClick={() => store.setRightTab('anthropic')}
            className={`transition-colors ${store.rightTab === 'anthropic' ? 'text-white' : 'hover:text-white'}`}
          >
            ANTHROPIC
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {store.rightTab === 'compiled' && (
            <pre className="font-mono text-xs text-white/80 whitespace-pre-wrap leading-relaxed">
              {store.compiled}
            </pre>
          )}
          {store.rightTab === 'openai' && (
            <pre className="font-mono text-xs text-[#3B82F6] whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(
                {
                  model: 'gpt-4-turbo',
                  messages: [
                    { role: 'system', content: 'You are an elite application security engineer.' },
                    { role: 'user', content: 'Review the following ts code...' },
                  ],
                },
                null,
                2,
              )}
            </pre>
          )}
          {store.rightTab === 'anthropic' && (
            <pre className="font-mono text-xs text-[#F59E0B] whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(
                {
                  model: 'claude-3-opus-20240229',
                  system: 'You are an elite application security engineer.',
                  messages: [{ role: 'user', content: 'Review the following ts code...' }],
                },
                null,
                2,
              )}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
