import type { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import * as templates from '@promptforgee/templates';

export const templateCommand = (program: Command) => {
  program
    .command('template <name>')
    .description('Export an official PromptForge template to a local markdown file')
    .action((name: string) => {
      const TemplateClass = (templates as Record<string, { build: () => string }>)[name];

      if (!TemplateClass) {
        console.error(chalk.red(`✖ Template '${name}' not found.`));
        console.log(chalk.gray(`Available templates: ${Object.keys(templates).join(', ')}`));
        process.exit(1);
      }

      const promptStr = TemplateClass.build();
      const filename = `${name.toLowerCase()}.md`;
      const outPath = path.join(process.cwd(), filename);

      fs.writeFileSync(outPath, promptStr);
      console.log(chalk.green(`✔ Exported template to ${chalk.bold(filename)}`));
    });
};
