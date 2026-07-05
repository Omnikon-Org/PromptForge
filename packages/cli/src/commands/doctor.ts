import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export const doctorCommand = (program: Command) => {
  program
    .command('doctor')
    .description('Check project for PromptForge configuration and dependency health')
    .action(() => {
      console.log(chalk.blue.bold('⚕️ Running PromptForge Doctor...'));
      let healthy = true;

      const configPath = path.join(process.cwd(), 'promptforge.config.json');
      if (fs.existsSync(configPath)) {
        console.log(chalk.green('✔ Configuration file found.'));
      } else {
        console.log(chalk.yellow('! Configuration file missing. Run `promptforge init`.'));
        healthy = false;
      }

      const pkgPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps['@promptforgee/core']) {
          console.log(chalk.green('✔ @promptforgee/core is installed.'));
        } else {
          console.log(chalk.yellow('! @promptforgee/core is not in package.json.'));
          healthy = false;
        }
      } else {
        console.log(chalk.red('✖ No package.json found in current directory.'));
        healthy = false;
      }

      if (healthy) {
        console.log(chalk.green.bold('\n✨ Everything looks great!'));
      } else {
        console.log(chalk.yellow.bold('\n⚠️ Some issues were found. Review the warnings above.'));
      }
    });
};
