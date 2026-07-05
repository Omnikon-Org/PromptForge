/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { Prompt } from '@promptforgee/core';
import { analyzePrompt } from '@promptforgee/analyzer';
import { optimizePrompt } from '@promptforgee/optimizer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  BarChart2,
  Copy,
  Download,
  SplitSquareHorizontal,
  Plus,
  X,
  Check,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function PlaygroundPage() {
  const [role, setRole] = useState('Senior Security Engineer');
  const [task, setTask] = useState('Review this code for vulnerabilities');
  const [format, setFormat] = useState('JSON array of vulnerability objects');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [language, setLanguage] = useState('');
  const [contexts, setContexts] = useState<string[]>(['The code is written in Node.js']);
  const [constraints, setConstraints] = useState<string[]>([
    'Include CVSS scores',
    'Do not include false positives',
  ]);
  const [examples, setExamples] = useState<{ input: string; output: string }[]>([]);

  const [compiled, setCompiled] = useState('');
  const [optimizedCompiled, setOptimizedCompiled] = useState('');

  const [score, setScore] = useState<number | null>(null);
  const [optScore, setOptScore] = useState<number | null>(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [optTokens, setOptTokens] = useState<number | null>(null);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [compareMode, setCompareMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build the prompt whenever inputs change
  useEffect(() => {
    try {
      let p = Prompt.create().role(role).task(task);

      if (format) p = p.output(format);
      if (tone) p = p.tone(tone);
      if (audience) p = p.audience(audience);
      if (language) p = p.language(language);
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
      setCompiled('Error building prompt');
    }
  }, [role, task, format, tone, audience, language, contexts, constraints, examples]);

  // List Handlers
  const addContext = () => setContexts([...contexts, '']);
  const updateContext = (idx: number, val: string) => {
    const next = [...contexts];
    next[idx] = val;
    setContexts(next);
  };
  const removeContext = (idx: number) => setContexts(contexts.filter((_, i) => i !== idx));

  const addConstraint = () => setConstraints([...constraints, '']);
  const updateConstraint = (idx: number, val: string) => {
    const next = [...constraints];
    next[idx] = val;
    setConstraints(next);
  };
  const removeConstraint = (idx: number) => setConstraints(constraints.filter((_, i) => i !== idx));

  const addExample = () => setExamples([...examples, { input: '', output: '' }]);
  const updateExampleInput = (idx: number, val: string) => {
    const next = [...examples];
    next[idx].input = val;
    setExamples(next);
  };
  const updateExampleOutput = (idx: number, val: string) => {
    const next = [...examples];
    next[idx].output = val;
    setExamples(next);
  };
  const removeExample = (idx: number) => setExamples(examples.filter((_, i) => i !== idx));

  // Action Handlers
  const handleAnalyze = async (textToAnalyze: string, isOpt: boolean = false) => {
    if (!isOpt) setIsAnalyzing(true);
    try {
      const report = await analyzePrompt(textToAnalyze);
      if (isOpt) {
        setOptScore(report.overallScore);
        setOptTokens(report.estimatedTokenCount);
      } else {
        setScore(report.overallScore);
        setTokens(report.estimatedTokenCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!isOpt) setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      let p = Prompt.create().role(role).task(task);
      if (format) p = p.output(format);
      if (tone) p = p.tone(tone);
      if (audience) p = p.audience(audience);
      if (language) p = p.language(language);
      contexts.forEach((c) => {
        if (c) p = p.context(c);
      });
      constraints.forEach((c) => {
        if (c) p = p.constraint(c);
      });
      examples.forEach((e) => {
        if (e.input && e.output) p = p.example(e.input, e.output);
      });

      const optimized = await optimizePrompt(p);
      const optStr = optimized.build();

      if (compareMode) {
        setOptimizedCompiled(optStr);
        await handleAnalyze(compiled, false);
        await handleAnalyze(optStr, true);
      } else {
        const state = optimized.getState();
        setRole(state.role || '');
        setTask(state.task || '');
        setFormat(state.output || '');
        setTone(state.tone || '');
        setAudience(state.audience || '');
        setLanguage(state.language || '');
        setContexts(state.contexts || []);
        setConstraints(state.constraints || []);
        setExamples(state.examples || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = compareMode ? optimizedCompiled || compiled : compiled;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      // Fallback for non-secure contexts (e.g. testing over local network IP)
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (error) {
        console.error('Fallback copy failed', error);
      } finally {
        textArea.remove();
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const data = compareMode ? optimizedCompiled || compiled : compiled;
    const blob = new Blob([data], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'promptforge-export.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px] min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Playground</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ' +
              (compareMode
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                : 'bg-secondary text-secondary-foreground border border-border hover:bg-accent')
            }
          >
            <SplitSquareHorizontal className="h-4 w-4" />
            {compareMode ? 'Exit Compare' : 'Compare Optimized'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        {/* Left Pane: Visual Builder */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-sm flex-1">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                1
              </span>
              Visual Builder
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Role / Persona
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Expert React Developer"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Task</label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  rows={3}
                  placeholder="What should the AI do?"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Output Format
                </label>
                <input
                  type="text"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  placeholder="e.g. JSON, Markdown, XML"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Tone
                  </label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="e.g. Professional"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Junior Devs"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. Spanish"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
                  />
                </div>
              </div>

              {/* Dynamic Contexts */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Contexts
                  </label>
                  <button
                    onClick={addContext}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {contexts.map((ctx, idx) => (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        key={idx}
                        className="flex gap-2"
                      >
                        <input
                          value={ctx}
                          onChange={(e) => updateContext(idx, e.target.value)}
                          className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <button
                          onClick={() => removeContext(idx)}
                          aria-label="Remove context"
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic Constraints */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Constraints
                  </label>
                  <button
                    onClick={addConstraint}
                    className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {constraints.map((ctx, idx) => (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        key={idx}
                        className="flex gap-2"
                      >
                        <input
                          value={ctx}
                          onChange={(e) => updateConstraint(idx, e.target.value)}
                          className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => removeConstraint(idx)}
                          aria-label="Remove constraint"
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Few-Shot Examples */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Few-Shot Examples
                  </label>
                  <button
                    onClick={addExample}
                    className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {examples.map((ex, idx) => (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        key={idx}
                        className="flex flex-col gap-2 p-3 bg-background border border-border rounded-lg relative"
                      >
                        <button
                          onClick={() => removeExample(idx)}
                          aria-label="Remove example"
                          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <input
                          placeholder="Input"
                          value={ex.input}
                          onChange={(e) => updateExampleInput(idx, e.target.value)}
                          className="flex-1 bg-zinc-950/50 border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 pr-6"
                        />
                        <textarea
                          placeholder="Expected Output"
                          rows={2}
                          value={ex.output}
                          onChange={(e) => updateExampleOutput(idx, e.target.value)}
                          className="flex-1 bg-zinc-950/50 border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Preview & Actions */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Action Toolbar */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => handleAnalyze(compiled, false)}
                disabled={isAnalyzing}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                <BarChart2 className="h-4 w-4 text-blue-400" />
                Analyze
              </button>
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-2 bg-cyan-500 text-zinc-950 px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                <RefreshCw className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                Optimize
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                Export .md
              </button>
            </div>
          </div>

          {/* Compilation Views */}
          <div className={`flex-1 grid grid-cols-1 ${compareMode ? 'md:grid-cols-2' : ''} gap-6`}>
            {/* Original Preview */}
            <div className="flex flex-col p-6 rounded-xl border border-border bg-card/50 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    V1
                  </span>
                  {compareMode ? 'Original' : 'Compiled Output'}
                </h2>
                {score !== null && (
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-zinc-900 border border-border rounded text-xs font-mono text-muted-foreground">
                      {tokens} tokens
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${score >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                    >
                      {score >= 80 ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {score}/100
                    </span>
                  </div>
                )}
              </div>
              <pre className="bg-zinc-950 border border-border p-4 rounded-lg overflow-auto flex-1 h-[400px]">
                <code className="text-sm font-mono text-cyan-50 whitespace-pre-wrap">
                  {compiled}
                </code>
              </pre>
            </div>

            {/* Optimized Preview (Compare Mode Only) */}
            {compareMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col p-6 rounded-xl border border-cyan-500/30 bg-card/50 shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                <div className="flex justify-between items-center mb-4 mt-2">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-cyan-400">
                    <span className="h-6 w-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      V2
                    </span>
                    Optimized
                  </h2>
                  {optScore !== null && (
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-zinc-900 border border-border rounded text-xs font-mono text-cyan-400/60">
                        {optTokens} tokens
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${optScore >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                      >
                        {optScore >= 80 ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {optScore}/100
                      </span>
                    </div>
                  )}
                </div>
                <pre className="bg-[#040914] border border-cyan-900/50 p-4 rounded-lg overflow-auto flex-1 h-[400px]">
                  <code className="text-sm font-mono text-cyan-50 whitespace-pre-wrap">
                    {optimizedCompiled || 'Run Auto-Optimize to generate comparison...'}
                  </code>
                </pre>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
