const fs = require('fs');
const path = require('path');

const corePkgPath = path.join(__dirname, 'packages/core/package.json');
const pkg = JSON.parse(fs.readFileSync(corePkgPath, 'utf8'));

pkg.name = '@promptforgee/core';
pkg.version = '1.0.0';
pkg.description =
  'Production-grade prompt engineering toolkit. Type-safe, composable, and extensible.';
pkg.keywords = [
  'prompt',
  'prompt-engineering',
  'llm',
  'ai',
  'typescript',
  'openai',
  'anthropic',
  'gemini',
  'ollama',
  'zod',
  'compiler',
  'developer-tools',
];
pkg.homepage = 'https://github.com/Omnikon-Org/PromptForge/tree/main/packages/core#readme';
pkg.repository = {
  type: 'git',
  url: 'https://github.com/Omnikon-Org/PromptForge.git',
  directory: 'packages/core',
};
pkg.bugs = {
  url: 'https://github.com/Omnikon-Org/PromptForge/issues',
};
pkg.license = 'MIT';
pkg.author = 'Omnikon';
pkg.funding = 'https://github.com/sponsors/Omnikon-Org';
pkg.publishConfig = {
  access: 'public',
};
pkg.sideEffects = false;
pkg.files = ['dist'];

// Ensure engines is set
pkg.engines = {
  node: '>=18',
};

fs.writeFileSync(corePkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('Updated packages/core/package.json');
