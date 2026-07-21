#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { analyzeCommand } from './commands/analyze';
import { optimizeCommand } from './commands/optimize';
import { doctorCommand } from './commands/doctor';
import { templateCommand } from './commands/template';
import { generateCommand } from './commands/generate';
import { lintCommand } from './commands/lint';
import { statsCommand } from './commands/stats';
import { formatCommand } from './commands/format';

const program = new Command();

program
  .name('promptforge')
  .description(chalk.blue.bold('PromptForge CLI: Enterprise Prompt Engineering Toolkit'))
  .version('0.1.0');

// Register Commands
initCommand(program);
analyzeCommand(program);
optimizeCommand(program);
doctorCommand(program);
templateCommand(program);
generateCommand(program);
lintCommand(program);
statsCommand(program);
formatCommand(program);

// Handle unknown commands
program.on('command:*', () => {
  console.error(
    chalk.red('Invalid command: %s\nSee --help for a list of available commands.'),
    program.args.join(' '),
  );
  process.exit(1);
});

if (require.main === module) {
  program.parse(process.argv);
}

export { program };
