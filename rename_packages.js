const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /@omnikon\/promptforge/g, to: '@promptforgee/core' },
  { from: /@promptforge\/analyzer/g, to: '@promptforgee/analyzer' },
  { from: /@promptforge\/optimizer/g, to: '@promptforgee/optimizer' },
  { from: /@promptforge\/cli/g, to: '@promptforgee/cli' },
  { from: /@promptforge\/templates/g, to: '@promptforgee/templates' },
  { from: /@promptforge\/react/g, to: '@promptforgee/react' },
  { from: /@promptforge\/registry/g, to: '@promptforgee/registry' },
  { from: /@promptforge\/schema/g, to: '@promptforgee/schema' },
  { from: /@promptforge\/vscode/g, to: '@promptforgee/vscode' },
];

const ignoreDirs = ['node_modules', 'dist', '.turbo', '.next', '.git'];
const extenstions = ['.ts', '.tsx', '.json', '.md'];

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        walkAndReplace(fullPath);
      }
    } else {
      const ext = path.extname(fullPath);
      if (extenstions.includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        for (const r of replacements) {
          if (content.match(r.from)) {
            content = content.replace(r.from, r.to);
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

console.log('Starting workspace namespace migration...');
walkAndReplace(__dirname);
console.log('Migration complete.');
