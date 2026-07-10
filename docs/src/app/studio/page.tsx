/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

export default function StudioPage() {
  const [mode, setMode] = useState<'builder' | 'code' | 'templates'>('builder');
  const [rightTab, setRightTab] = useState<'compiled' | 'openai' | 'anthropic'>('compiled');
  const [bottomTab, setBottomTab] = useState<'problems' | 'analyzer' | 'optimizer'>('analyzer');

  // -- SETTINGS & AUTH --
  const [hfToken, setHfToken] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempToken, setTempToken] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('hf_token');
    if (saved) {
      setHfToken(saved);
      setTempToken(saved);
    }
  }, []);

  const saveToken = () => {
    setHfToken(tempToken);
    localStorage.setItem('hf_token', tempToken);
    setShowSettings(false);
  };

  // -- BUILDER STATE --
  const [role, setRole] = useState('Senior Security Engineer');
  const [task, setTask] = useState('Review this code for vulnerabilities');
  const [format, setFormat] = useState('JSON array of vulnerability objects');
  const [contexts, setContexts] = useState<string[]>(['The code is written in Node.js']);
  const [constraints, setConstraints] = useState<string[]>([
    'Include CVSS scores',
    'Do not include false positives',
  ]);
  const [examples, setExamples] = useState<{ input: string; output: string }[]>([]);

  // -- CODE STATE --
  const [code, setCode] = useState(`import { pf } from 'promptforge';
import { z } from 'promptforge/schema';

export const analyzeCode = pf.define({
  input: z.object({
    code: z.string(),
    language: z.enum(['ts', 'js', 'python'])
  }),
  output: z.object({
    vulnerabilities: z.array(z.object({
      type: z.string(),
      severity: z.string(),
      line: z.number()
    }))
  }),
  messages: (vars) => [
    pf.system\`You are an elite application security engineer.\`,
    pf.user\`Review the following \${vars.language} code for security vulnerabilities. 
Code:
\${vars.code}\`
  ]
});`);

  // -- OUTPUT STATE --
  const [compiled, setCompiled] = useState('');

  // Analyzer State
  const [score, setScore] = useState<number | null>(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState('');

  // Optimizer State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState('');
  const [optimizationError, setOptimizationError] = useState('');

  // Auto-compile builder state
  useEffect(() => {
    if (mode === 'builder') {
      try {
        let p = Prompt.create().role(role).task(task);
        if (format) p = p.output(format);
        contexts.forEach((c) => {
          if (c) p = p.context(c);
        });
        constraints.forEach((c) => {
          if (c) p = p.constraint(c);
        });
        examples.forEach((e) => {
          if (e.input && e.output) p = p.example(e.input, e.output);
        });
        setCompiled(p.build());
      } catch (e) {
        setCompiled('Error compiling visual prompt.');
      }
    } else if (mode === 'code') {
      setCompiled(`SYSTEM: You are an elite application security engineer.
USER: Review the following \${vars.language} code for security vulnerabilities.
Code:
\${vars.code}

OUTPUT FORMAT:
{
  "vulnerabilities": [
    {
      "type": "string",
      "severity": "string",
      "line": 0
    }
  ]
}`);
    }
  }, [mode, role, task, format, contexts, constraints, examples, code]);

  const handleAnalyze = async () => {
    if (!hfToken) {
      setShowSettings(true);
      return;
    }

    setIsAnalyzing(true);
    setBottomTab('analyzer');
    setAnalysisError('');

    try {
      const hf = new HfInference(hfToken);
      const systemPrompt = `You are a strict Prompt Engineering Evaluator. Analyze the user's prompt. 
Evaluate it out of 100 on Clarity, Task Isolation, and Constraints.
You MUST output ONLY valid JSON in the following format, with no markdown formatting, no code blocks, and no extra text.
{
  "score": 85,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "suggestions": ["string", "string"]
}`;

      const response = await hf.chatCompletion({
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: compiled },
        ],
        max_tokens: 500,
        temperature: 0.1,
      });

      let content = response.choices[0].message.content;
      if (!content) throw new Error('Empty response from LLM');

      // Clean up markdown block if LLM adds it
      if (content.includes('\`\`\`')) {
        content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
      }

      const data = JSON.parse(content.trim());
      setAnalysisReport(data);
      setScore(data.score);
      setTokens(Math.ceil(compiled.length / 4)); // rough token count
    } catch (e: any) {
      console.error(e);
      setAnalysisError(e.message || 'Failed to analyze prompt.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!hfToken) {
      setShowSettings(true);
      return;
    }

    setIsOptimizing(true);
    setBottomTab('optimizer');
    setOptimizationError('');

    try {
      const hf = new HfInference(hfToken);
      const systemPrompt = `You are an elite Prompt Optimizer. Your task is to rewrite the user's prompt to make it significantly better, more concise, and highly effective for LLMs.
Remove filler words, strengthen constraints, and structure the prompt cleanly using standard prompt engineering practices.
Return ONLY the rewritten prompt text. Do not wrap in quotes or code blocks unless part of the prompt. Do not include introductory text.`;

      const response = await hf.chatCompletion({
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: compiled },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      setOptimizedCode(response.choices[0].message.content || '');
    } catch (e: any) {
      console.error(e);
      setOptimizationError(e.message || 'Failed to optimize prompt.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-[#050608] text-[#9CA3AF] font-mono overflow-hidden text-sm">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0B0D11] border border-white/[0.08] p-6 rounded-lg w-full max-w-md shadow-2xl">
            <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#3B82F6]" /> Setup LLM Integration
            </h2>
            <p className="text-xs text-[#9CA3AF] mb-4 leading-relaxed">
              PromptForge Studio uses Hugging Face Inference API for real-time analysis and
              optimization. Paste your free Hugging Face Access Token below.
            </p>
            <input
              type="password"
              placeholder="hf_..."
              value={tempToken}
              onChange={(e) => setTempToken(e.target.value)}
              className="w-full bg-[#050608] border border-white/[0.08] rounded px-3 py-2 mb-4 text-white focus:outline-none focus:border-[#3B82F6]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSettings(false)}
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
        <button className="hover:text-white transition-colors">
          <Star className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowSettings(true)}
          className={`${hfToken ? 'text-[#22C55E]' : 'text-yellow-500'} hover:text-white transition-colors`}
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
              onClick={() => setMode('builder')}
              className={`h-full px-4 flex items-center gap-2 border-r border-white/[0.04] ${mode === 'builder' ? 'bg-[#050608] text-white border-t-2 border-t-[#3B82F6]' : 'hover:bg-white/[0.02]'}`}
            >
              <Box className="w-3.5 h-3.5 text-[#3B82F6]" /> Visual Builder
            </button>
            <button
              onClick={() => setMode('code')}
              className={`h-full px-4 flex items-center gap-2 border-r border-white/[0.04] ${mode === 'code' ? 'bg-[#050608] text-white border-t-2 border-t-[#F59E0B]' : 'hover:bg-white/[0.02]'}`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#F59E0B]" /> Code Editor
            </button>
          </div>

          {/* Toolbar Actions */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 hover:text-white transition-colors disabled:opacity-50"
            >
              <Activity
                className={`w-3.5 h-3.5 text-blue-400 ${isAnalyzing ? 'animate-pulse' : ''}`}
              />{' '}
              Analyze
            </button>
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="flex items-center gap-1.5 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#22C55E] ${isOptimizing ? 'animate-spin' : ''}`}
              />{' '}
              Optimize
            </button>
            <div className="w-px h-4 bg-white/[0.08] mx-1" />
            <button className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Share className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#050608] relative">
          {mode === 'code' ? (
            <div className="absolute inset-0 pt-2">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
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
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2">Task</label>
                <textarea
                  value={task}
                  rows={3}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Output Format
                </label>
                <input
                  type="text"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-colors text-white"
                />
              </div>
              <div className="pt-4 border-t border-white/[0.04]">
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Constraints
                </label>
                <div className="space-y-2">
                  {constraints.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={c}
                        onChange={(e) => {
                          const n = [...constraints];
                          n[i] = e.target.value;
                          setConstraints(n);
                        }}
                        className="flex-1 bg-[#080A0F] border border-white/[0.08] rounded px-3 py-1.5 focus:outline-none focus:border-[#22C55E] text-white"
                      />
                      <button
                        onClick={() => setConstraints(constraints.filter((_, idx) => idx !== i))}
                        className="px-2 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setConstraints([...constraints, ''])}
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
              onClick={() => setBottomTab('problems')}
              className={`h-full border-b-2 transition-colors ${bottomTab === 'problems' ? 'border-[#3B82F6] text-white' : 'border-transparent hover:text-white'}`}
            >
              Problems
            </button>
            <button
              onClick={() => setBottomTab('analyzer')}
              className={`h-full border-b-2 flex items-center gap-1.5 transition-colors ${bottomTab === 'analyzer' ? 'border-[#3B82F6] text-white' : 'border-transparent hover:text-white'}`}
            >
              <Activity className="w-3 h-3 text-blue-400" /> Analyzer Metrics
            </button>
            <button
              onClick={() => setBottomTab('optimizer')}
              className={`h-full border-b-2 flex items-center gap-1.5 transition-colors ${bottomTab === 'optimizer' ? 'border-[#3B82F6] text-white' : 'border-transparent hover:text-white'}`}
            >
              <RefreshCw className="w-3 h-3 text-[#22C55E]" /> Optimizer
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#080A0F]">
            {bottomTab === 'problems' && (
              <div className="flex flex-col items-center justify-center h-full text-white/40">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                No syntax problems detected in builder/code.
              </div>
            )}

            {bottomTab === 'analyzer' && (
              <div className="flex flex-col gap-4">
                {isAnalyzing ? (
                  <div className="text-white/60 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Running Mistral-Nemo Analysis...
                  </div>
                ) : analysisError ? (
                  <div className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {analysisError}
                  </div>
                ) : analysisReport ? (
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 border-r border-white/[0.04] pr-4">
                      <div className="flex items-center gap-8 mb-4">
                        <div>
                          <div className="text-xs text-white/50 mb-1">Score</div>
                          <div
                            className={`text-3xl font-bold flex items-center gap-2 ${score !== null && score >= 80 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}
                          >
                            {score}/100
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50 mb-1">Tokens</div>
                          <div className="text-2xl font-mono text-white">{tokens}</div>
                        </div>
                      </div>
                      {analysisReport.suggestions?.length > 0 && (
                        <div className="text-xs text-[#3B82F6]">
                          <strong className="block mb-1">Suggestions:</strong>
                          <ul className="list-disc pl-4 space-y-1 opacity-80">
                            {analysisReport.suggestions.map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="col-span-1 border-r border-white/[0.04] pr-4">
                      <strong className="text-xs text-[#22C55E] block mb-2">Strengths:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-white/80">
                        {analysisReport.strengths?.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-1">
                      <strong className="text-xs text-red-400 block mb-2">Weaknesses:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-white/80">
                        {analysisReport.weaknesses?.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/40 italic flex items-center justify-center h-full">
                    Click Analyze to run Hugging Face Evaluation
                  </div>
                )}
              </div>
            )}

            {bottomTab === 'optimizer' && (
              <div className="flex flex-col gap-2 h-full">
                {isOptimizing ? (
                  <div className="text-white/60 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Rewriting prompt using
                    Mistral-Nemo...
                  </div>
                ) : optimizationError ? (
                  <div className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {optimizationError}
                  </div>
                ) : optimizedCode ? (
                  <pre className="text-[#22C55E] whitespace-pre-wrap font-mono text-xs leading-relaxed overflow-y-auto">
                    {optimizedCode}
                  </pre>
                ) : (
                  <div className="text-white/40 italic flex items-center justify-center h-full">
                    Click Optimize to generate an improved version of your prompt.
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
            onClick={() => setRightTab('compiled')}
            className={`transition-colors ${rightTab === 'compiled' ? 'text-white' : 'hover:text-white'}`}
          >
            COMPILED
          </button>
          <button
            onClick={() => setRightTab('openai')}
            className={`transition-colors ${rightTab === 'openai' ? 'text-white' : 'hover:text-white'}`}
          >
            OPENAI
          </button>
          <button
            onClick={() => setRightTab('anthropic')}
            className={`transition-colors ${rightTab === 'anthropic' ? 'text-white' : 'hover:text-white'}`}
          >
            ANTHROPIC
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {rightTab === 'compiled' && (
            <pre className="font-mono text-xs text-white/80 whitespace-pre-wrap leading-relaxed">
              {compiled}
            </pre>
          )}
          {rightTab === 'openai' && (
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
          {rightTab === 'anthropic' && (
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
