'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useStudioStore } from '@/store/studioStore';
import { Search, CornerDownLeft, Command as CmdIcon, FileText } from 'lucide-react';

export function CommandPalette() {
  const { isCommandPaletteOpen, setPaletteOpen, commands, dispatchAction, recentActions } =
    useStudioStore();

  const [search, setSearch] = React.useState('');

  // Toggle with Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen(!isCommandPaletteOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, setPaletteOpen]);

  // Filter commands based on .when()
  const state = useStudioStore();
  const availableCommands = React.useMemo(() => {
    return Object.values(commands).filter((cmd) => !cmd.when || cmd.when(state));
  }, [commands, state]);

  // Group commands
  const categories = React.useMemo(() => {
    const groups: Record<string, typeof availableCommands> = {};

    // Add Recents first
    const recentCmds = recentActions
      .map((action) => availableCommands.find((c) => c.action === action))
      .filter(Boolean) as typeof availableCommands;

    if (recentCmds.length > 0 && !search) {
      groups['Recent'] = recentCmds.slice(0, 4);
    }

    availableCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      // Prevent duplicates in category if they are in Recents (only when not searching)
      if (!search && groups['Recent']?.find((c) => c.id === cmd.id)) return;
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [availableCommands, recentActions, search]);

  const runCommand = React.useCallback(
    (action: string) => {
      dispatchAction(action);
      setSearch('');
    },
    [dispatchAction],
  );

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center pt-[15vh] bg-black/60 backdrop-blur-sm px-4">
      <div className="fixed inset-0" onClick={() => setPaletteOpen(false)} />

      <Command
        className="relative w-full max-w-2xl bg-[#0B0D11] border border-white/[0.08] shadow-2xl rounded-xl overflow-hidden font-mono text-sm flex flex-col max-h-[60vh] transform scale-100 opacity-100 transition-all"
        shouldFilter={false} // Custom fuzzy search if needed, but cmdk built-in is usually fine. Wait, we want aliases/keywords.
        filter={(value, s) => {
          if (!s) return 1;
          const cmd = availableCommands.find((c) => c.id === value);
          if (!cmd) return 0;
          const terms = [cmd.title, cmd.category, ...(cmd.keywords || []), ...(cmd.aliases || [])]
            .join(' ')
            .toLowerCase();
          return terms.includes(s.toLowerCase()) ? 1 : 0;
        }}
      >
        <div className="flex items-center px-4 border-b border-white/[0.08]">
          <Search className="w-5 h-5 text-white/40 mr-3 shrink-0" />
          <Command.Input
            autoFocus
            value={search}
            onValueChange={setSearch}
            placeholder="Search commands..."
            className="flex-1 bg-transparent border-none py-4 outline-none text-white placeholder:text-white/30 font-mono text-sm"
          />
          <div className="flex items-center gap-1 text-[10px] text-white/30 border border-white/[0.08] rounded px-1.5 py-0.5">
            <CmdIcon className="w-3 h-3" /> K
          </div>
        </div>

        <Command.List className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Command.Empty className="py-12 text-center text-white/40 text-sm">
            No commands found.
            <div className="mt-4 flex flex-col gap-2 items-center">
              <button
                onClick={() => runCommand('navigation.docs')}
                className="text-[#3B82F6] hover:underline"
              >
                Search Documentation
              </button>
              <button
                onClick={() => runCommand('prompt.create')}
                className="text-[#3B82F6] hover:underline"
              >
                Create Prompt
              </button>
            </div>
          </Command.Empty>

          {Object.entries(categories).map(([category, cmds]) => {
            if (cmds.length === 0) return null;
            return (
              <Command.Group
                key={category}
                heading={category.toUpperCase()}
                className="text-[10px] text-white/40 font-bold tracking-wider mb-2 px-2 pt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:mb-2"
              >
                {cmds.map((cmd) => (
                  <Command.Item
                    key={cmd.id}
                    value={cmd.id}
                    onSelect={() => runCommand(cmd.action)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer text-white/80 aria-selected:bg-[#3B82F6] aria-selected:text-white group transition-colors"
                  >
                    <div className="shrink-0 text-white/40 group-aria-selected:text-white/80">
                      {cmd.icon || <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 truncate">{cmd.title}</div>

                    {/* Shortcuts / Badges */}
                    {cmd.shortcut && (
                      <div className="flex gap-1">
                        {cmd.shortcut.map((key) => (
                          <kbd
                            key={key}
                            className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-sans group-aria-selected:bg-black/20 group-aria-selected:border-transparent"
                          >
                            {key === 'meta' ? '⌘' : key === 'enter' ? '↵' : key.toUpperCase()}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>

        {/* Footer */}
        <div className="border-t border-white/[0.08] bg-[#050608] p-2 flex items-center justify-between text-[10px] text-white/30">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-white/5 px-1 rounded border border-white/10">↑</kbd>
              <kbd className="bg-white/5 px-1 rounded border border-white/10">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Execute
            </span>
          </div>
          <div>PromptForge Studio</div>
        </div>
      </Command>
    </div>
  );
}
