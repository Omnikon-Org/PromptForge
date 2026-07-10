import { create } from 'zustand';
import { ReactNode } from 'react';

// --- Command Types ---
export interface StudioCommand {
  id: string;
  title: string;
  description?: string;
  category: string;
  keywords?: string[];
  aliases?: string[];
  icon?: ReactNode;
  shortcut?: string[];
  priority?: number;
  action: string;
  when?: (state: StudioState) => boolean;
  preview?: (state: StudioState) => ReactNode;
}

export type ActionHandler = (
  state: StudioState,
  get: () => StudioState,
  set: (partial: Partial<StudioState> | ((state: StudioState) => Partial<StudioState>)) => void,
) => void | Promise<void>;

// --- Store Interface ---
export interface StudioState {
  // UI State
  mode: 'builder' | 'code' | 'templates';
  rightTab: 'compiled' | 'openai' | 'anthropic';
  bottomTab: 'problems' | 'analyzer' | 'optimizer';
  isCommandPaletteOpen: boolean;

  // Builder State
  role: string;
  task: string;
  format: string;
  contexts: string[];
  constraints: string[];
  examples: { input: string; output: string }[];

  // Code State
  code: string;
  compiled: string;

  // Analyzer / Optimizer State
  hfToken: string;
  isAnalyzing: boolean;
  analysisReport: unknown;
  score: number | null;
  tokens: number | null;
  analysisError: string;
  isOptimizing: boolean;
  optimizedCode: string;
  optimizationError: string;
  showSettings: boolean;

  // Command Registry
  commands: Record<string, StudioCommand>;
  actionHandlers: Record<string, ActionHandler>;
  recentActions: string[];

  // Mutators
  setMode: (mode: 'builder' | 'code' | 'templates') => void;
  setRightTab: (tab: 'compiled' | 'openai' | 'anthropic') => void;
  setBottomTab: (tab: 'problems' | 'analyzer' | 'optimizer') => void;
  setPaletteOpen: (open: boolean) => void;

  setBuilderField: (field: string, value: unknown) => void;
  setCode: (code: string) => void;
  setCompiled: (compiled: string) => void;
  setAuth: (token: string) => void;
  setShowSettings: (show: boolean) => void;
  setAnalyzerState: (state: Partial<StudioState>) => void;

  // Registry API
  registerCommands: (cmds: StudioCommand[]) => void;
  unregisterCommand: (id: string) => void;
  registerActionHandler: (action: string, handler: ActionHandler) => void;
  dispatchAction: (action: string) => void;
  loadRecentActions: () => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  // UI
  mode: 'builder',
  rightTab: 'compiled',
  bottomTab: 'analyzer',
  isCommandPaletteOpen: false,

  // Builder
  role: 'Senior Security Engineer',
  task: 'Review this code for vulnerabilities',
  format: 'JSON array of vulnerability objects',
  contexts: ['The code is written in Node.js'],
  constraints: ['Include CVSS scores', 'Do not include false positives'],
  examples: [],

  // Code
  code: `import { pf } from '@promptforgee/core';
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
});`,
  compiled: '',

  // Analyzer / Optimizer
  hfToken: '',
  isAnalyzing: false,
  analysisReport: null,
  score: null,
  tokens: null,
  analysisError: '',
  isOptimizing: false,
  optimizedCode: '',
  optimizationError: '',
  showSettings: false,

  // Registry
  commands: {},
  actionHandlers: {},
  recentActions: [],

  // Mutators
  setMode: (mode) => set({ mode }),
  setRightTab: (rightTab) => set({ rightTab }),
  setBottomTab: (bottomTab) => set({ bottomTab }),
  setPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

  setBuilderField: (field, value) => set({ [field]: value }),
  setCode: (code) => set({ code }),
  setCompiled: (compiled) => set({ compiled }),
  setAuth: (hfToken) => {
    set({ hfToken });
    if (typeof window !== 'undefined') {
      localStorage.setItem('hf_token', hfToken);
    }
  },
  setShowSettings: (showSettings) => set({ showSettings }),
  setAnalyzerState: (state) => set(state),

  // Registry API
  registerCommands: (cmds) =>
    set((state) => {
      const newCommands = { ...state.commands };
      cmds.forEach((c) => (newCommands[c.id] = c));
      return { commands: newCommands };
    }),
  unregisterCommand: (id) =>
    set((state) => {
      const newCommands = { ...state.commands };
      delete newCommands[id];
      return { commands: newCommands };
    }),
  registerActionHandler: (action, handler) =>
    set((state) => ({
      actionHandlers: { ...state.actionHandlers, [action]: handler },
    })),
  dispatchAction: (action) => {
    const { actionHandlers, recentActions } = get();
    const handler = actionHandlers[action];

    // Add to recents (only keep unique, max 10)
    const newRecents = [action, ...recentActions.filter((a) => a !== action)].slice(0, 10);
    set({ recentActions: newRecents, isCommandPaletteOpen: false });

    if (typeof window !== 'undefined') {
      localStorage.setItem('pf_recent_actions', JSON.stringify(newRecents));
    }

    if (handler) {
      handler(get(), get, set);
    } else {
      console.warn(`No handler registered for action: ${action}`);
    }
  },
  loadRecentActions: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pf_recent_actions');
      if (saved) {
        try {
          set({ recentActions: JSON.parse(saved) });
        } catch (e) {
          // Ignore parse errors
        }
      }
      const savedToken = localStorage.getItem('hf_token');
      if (savedToken) {
        set({ hfToken: savedToken });
      }
    }
  },
}));
