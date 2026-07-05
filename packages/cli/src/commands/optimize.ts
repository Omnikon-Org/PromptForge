import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import { Prompt } from '@promptforgee/core';
import { optimizePrompt } from '@promptforgee/optimizer';

export const optimizeCommand = (program: Command) => {
  program
    .command('optimize <file>')
    .description(
      'Aggressively optimize a raw prompt text file to reduce tokens and strengthen semantics',
    )
    .action(async (file: string) => {
      const filePath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`✖ File not found: ${filePath}`));
        process.exit(1);
      }

      const text = fs.readFileSync(filePath, 'utf-8');

      const spinner = ora('Optimizing prompt semantics...').start();

      try {
        // Very basic heuristic parsing for CLI usage
        // In production, users should optimize structured Prompt instances, but for CLI we do a best-effort parse.
        const lines = text.split('\n');
        let currentSection = 'task';
        let parsedState = Prompt.create();

        for (const line of lines) {
          const lower = line.toLowerCase();
          if (lower.includes('role:')) {
            currentSection = 'role';
            parsedState = parsedState.role(line.replace(/role:/i, '').trim());
          } else if (lower.includes('task:')) {
            currentSection = 'task';
            parsedState = parsedState.task(line.replace(/task:/i, '').trim());
          } else if (lower.includes('constraint:')) {
            parsedState = parsedState.constraint(line.replace(/constraint:/i, '').trim());
          } else if (line.trim().length > 0) {
            // Append to whatever the active section is
            if (currentSection === 'role' && !parsedState.getState().role) {
              parsedState = parsedState.role(line.trim());
            } else if (currentSection === 'task') {
              const currentTask = parsedState.getState().task || '';
              parsedState = parsedState.task(currentTask + ' ' + line.trim());
            }
          }
        }

        const optimizedPrompt = await optimizePrompt(parsedState);
        spinner.succeed('Optimization complete!\n');

        console.log(chalk.green.bold('--- Optimized Prompt ---'));
        console.log(optimizedPrompt.build());
      } catch (error: unknown) {
        spinner.fail('Optimization failed.');
        console.error(
          chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`),
        );
      }
    });
};
