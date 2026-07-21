import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { validatePrompt } from '@promptforgee/analyzer';

export const lintCommand = (program: Command) => {
  program
    .command('lint <file>')
    .description('Lint a prompt file for syntax errors, unused variables, and duplicates')
    .action(async (file: string) => {
      const filePath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`✖ File not found: ${filePath}`));
        process.exit(1);
      }

      const text = fs.readFileSync(filePath, 'utf-8');
      const diagnostics = validatePrompt(text);

      if (diagnostics.length === 0) {
        console.log(chalk.green('✔ No linting issues found!'));
        process.exit(0);
      }

      console.log(chalk.underline(filePath));

      let errors = 0;
      let warnings = 0;

      diagnostics.forEach((diag) => {
        const severityColor = diag.severity === 'error' ? chalk.red : chalk.yellow;
        const severityLabel = diag.severity === 'error' ? 'error  ' : 'warning';

        if (diag.severity === 'error') errors++;
        if (diag.severity === 'warning') warnings++;

        console.log(`  ${severityColor(severityLabel)}  ${diag.message}  ${chalk.dim(diag.code)}`);
      });

      console.log(
        `\n${chalk.red.bold('✖')} ${errors + warnings} problems (${errors} errors, ${warnings} warnings)`,
      );

      if (errors > 0) {
        process.exit(1);
      }
    });
};
