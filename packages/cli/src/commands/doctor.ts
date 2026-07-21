import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { validatePrompt } from '@promptforgee/analyzer';
import { checkContext, estimateTokens, ModelRegistry } from '@promptforgee/core';

export const doctorCommand = (program: Command) => {
  program
    .command('doctor <file>')
    .description('Summarize overall prompt health')
    .action(async (file: string) => {
      const filePath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`✖ File not found: ${filePath}`));
        process.exit(1);
      }

      const text = fs.readFileSync(filePath, 'utf-8');

      console.log(chalk.bold('Prompt Doctor Health Check\n'));

      const diagnostics = validatePrompt(text);

      // Variables check
      const missingVars = diagnostics.filter((d) => d.code === 'PF002' || d.code === 'PF003');
      if (missingVars.length === 0) {
        console.log(chalk.green('✔ Variables valid'));
      } else {
        console.log(chalk.red('✖ Missing, empty, or malformed variables found'));
      }

      // Context Window Check
      const context = await checkContext({ model: 'gpt-4o', prompt: text });
      if (context.fits) {
        console.log(chalk.green('✔ Context window OK'));
      } else {
        console.log(chalk.red('✖ Prompt exceeds context window'));
      }

      // Cost estimation
      const info = ModelRegistry.getModelInfo('gpt-4o');
      const tokens = await estimateTokens(text, { model: 'gpt-4o' });
      const estCost = info?.pricing ? (tokens / 1000) * info.pricing.inputPer1k : 0;
      console.log(chalk.green(`✔ Estimated cost: $${estCost.toFixed(5)} per use (GPT-4o)`));

      console.log(''); // spacer

      // Warnings
      diagnostics
        .filter((d) => d.severity === 'warning')
        .forEach((w) => {
          console.log(chalk.yellow(`⚠ ${w.message}`));
        });

      // Errors
      diagnostics
        .filter((d) => d.severity === 'error')
        .forEach((e) => {
          console.log(chalk.red(`✖ ${e.message}`));
        });

      if (diagnostics.length === 0) {
        console.log(chalk.blue('No warnings or errors. Prompt is in perfect health!'));
      }
    });
};
