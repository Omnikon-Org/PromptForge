import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import Table from 'cli-table3';
import { inspectPrompt } from '@promptforgee/core';

export const statsCommand = (program: Command) => {
  program
    .command('stats <file>')
    .description('Generate token and cost statistics for a prompt across different models')
    .action(async (file: string) => {
      const filePath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`✖ File not found: ${filePath}`));
        process.exit(1);
      }

      const text = fs.readFileSync(filePath, 'utf-8');

      const modelsToTest = ['gpt-4o', 'claude-3-opus-20240229', 'gemini-1.5-pro', 'llama-3-70b'];

      const table = new Table({
        head: [
          chalk.cyan('Model'),
          chalk.cyan('Tokens'),
          chalk.cyan('Est. Cost / 1k Uses'),
          chalk.cyan('Fits Context?'),
        ],
      });

      for (const model of modelsToTest) {
        const report = await inspectPrompt(text, { model });

        table.push([
          model,
          report.tokens.toString(),
          `$${(report.cost.inputCost * 1000).toFixed(4)}`,
          report.context.fits ? chalk.green('Yes') : chalk.red('No'),
        ]);
      }

      console.log(chalk.bold('\nPrompt Statistics\n'));
      console.log(table.toString());
    });
};
