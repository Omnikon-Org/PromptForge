import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export const initCommand = (program: Command) => {
  program
    .command('init')
    .description('Initialize a promptforge.config.json in the current directory')
    .action(async () => {
      const configPath = path.join(process.cwd(), 'promptforge.config.json');

      if (fs.existsSync(configPath)) {
        console.log(chalk.yellow('⚠️  promptforge.config.json already exists!'));
        return;
      }

      const config = {
        registry: 'local',
        format: 'markdown',
        plugins: [],
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green('✔ Successfully created promptforge.config.json!'));
    });
};
