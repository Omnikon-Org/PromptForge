import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import Table from 'cli-table3';
import { analyzePrompt } from '@promptforgee/analyzer';
import { inspectPrompt } from '@promptforgee/core';

export const analyzeCommand = (program: Command) => {
  program
    .command('analyze <file>')
    .description('Analyze a raw prompt text file for quality, cost, and tokens')
    .action(async (file: string) => {
      const filePath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`✖ File not found: ${filePath}`));
        process.exit(1);
      }

      const text = fs.readFileSync(filePath, 'utf-8');

      const spinner = ora('Analyzing prompt semantics...').start();

      try {
        const report = await analyzePrompt(text);
        const inspection = await inspectPrompt(text, { model: 'gpt-4o' });

        spinner.succeed('Analysis complete!\n');

        console.log(chalk.blue.bold('--- PromptForge Analysis Report ---'));

        const table = new Table({
          head: [chalk.cyan('Metric'), chalk.cyan('Value')],
        });

        table.push(
          [
            'Score',
            `${report.overallScore >= 80 ? chalk.green(report.overallScore) : chalk.yellow(report.overallScore)}/100`,
          ],
          ['Clarity', `${report.clarity}%`],
          ['Ambiguity', `${report.ambiguity}%`],
          ['Tokens (GPT-4o)', chalk.cyan(inspection.tokens.toString())],
          ['Estimated Cost / 1k Uses', `$${(inspection.cost.inputCost * 1000).toFixed(4)}`],
        );

        console.log(table.toString());

        if (inspection.diagnostics.length > 0) {
          console.log(chalk.bold('\nDiagnostics:'));
          inspection.diagnostics.forEach((d) => {
            const color =
              d.severity === 'error'
                ? chalk.red
                : d.severity === 'warning'
                  ? chalk.yellow
                  : chalk.blue;
            console.log(`  ${color(d.severity)}  ${d.message}  ${chalk.dim(d.code)}`);
          });
        }
      } catch (error: unknown) {
        spinner.fail('Analysis failed.');
        console.error(
          chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`),
        );
      }
    });
};
