import type { Command } from 'commander';
import chalk from 'chalk';
import readline from 'readline';
import { Prompt } from '@promptforgee/core';

export const generateCommand = (program: Command) => {
  program
    .command('generate')
    .description('Interactively build a Prompt via CLI questionnaire')
    .action(async () => {
      console.log(chalk.blue.bold('\n✨ Welcome to the PromptForge Generator\n'));

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const question = (query: string): Promise<string> => {
        return new Promise((resolve) => rl.question(chalk.green(query), resolve));
      };

      try {
        const role = await question('What is the Persona/Role? (e.g. Expert Developer): ');
        const task = await question('What is the primary Task? (e.g. Write a script): ');
        const format = await question('What is the required Output Format? (e.g. JSON): ');

        rl.close();

        let builder = Prompt.create();
        if (role.trim()) builder = builder.role(role.trim());
        if (task.trim()) builder = builder.task(task.trim());
        if (format.trim()) builder = builder.output(format.trim());

        console.log(chalk.cyan.bold('\n--- Generated Prompt ---\n'));
        console.log(builder.build());
      } catch (err) {
        rl.close();
        console.error(chalk.red('\nGeneration failed.'));
      }
    });
};
