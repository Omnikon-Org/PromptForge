import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import { analyzePrompt } from '@promptforgee/analyzer';

export const analyzeCommand = (program: Command) => {
  program
    .command('analyze <file>')
    .description('Analyze a raw prompt text file for quality and token count')
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
        spinner.succeed('Analysis complete!\n');

        console.log(chalk.blue.bold('--- PromptForge Analysis Report ---'));
        console.log(
          `Overall Score: ${report.overallScore >= 80 ? chalk.green(report.overallScore) : chalk.yellow(report.overallScore)}/100`,
        );
        console.log(`Clarity: ${report.clarity}%`);
        console.log(`Ambiguity: ${report.ambiguity}%`);
        console.log(`Readability: ${report.readability}`);
        console.log(`Est. Tokens: ${chalk.cyan(report.estimatedTokenCount)}`);

        if (report.missingInformation.length > 0) {
          console.log(chalk.red.bold('\nMissing Information:'));
          report.missingInformation.forEach((info) => console.log(chalk.red(`  - ${info}`)));
        }

        if (report.strengths.length > 0) {
          console.log(chalk.green.bold('\nStrengths:'));
          report.strengths.forEach((str) => console.log(chalk.green(`  ✔ ${str}`)));
        }

        if (report.weaknesses.length > 0) {
          console.log(chalk.yellow.bold('\nWeaknesses:'));
          report.weaknesses.forEach((wk) => console.log(chalk.yellow(`  ! ${wk}`)));
        }

        if (report.suggestions.length > 0) {
          console.log(chalk.magenta.bold('\nSuggestions:'));
          report.suggestions.forEach((sug) => console.log(chalk.magenta(`  💡 ${sug}`)));
        }
      } catch (error: unknown) {
        spinner.fail('Analysis failed.');
        console.error(
          chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`),
        );
      }
    });
};
