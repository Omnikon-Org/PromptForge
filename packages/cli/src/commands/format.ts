import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { formatPrompt } from '@promptforgee/core';

export const formatCommand = (program: Command) => {
  program
    .command('format <file>')
    .description('Format prompt using Prettier-like rules')
    .option('-w, --write', 'Write formatted output back to file')
    .action(async (file: string, options: { write?: boolean }) => {
      const filePath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`✖ File not found: ${filePath}`));
        process.exit(1);
      }

      const text = fs.readFileSync(filePath, 'utf-8');
      const formatted = formatPrompt(text);

      if (options.write) {
        fs.writeFileSync(filePath, formatted, 'utf-8');
        console.log(chalk.green(`✔ Formatted prompt written to ${filePath}`));
      } else {
        console.log(chalk.blue('--- Formatted Prompt ---'));
        console.log(formatted);
      }
    });
};
