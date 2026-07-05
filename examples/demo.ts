import { Prompt } from '@promptforgee/core';
import { analyzePrompt } from '@promptforgee/analyzer';
import { optimizePrompt } from '@promptforgee/optimizer';

async function main() {
  console.log('=== 1. Building the Prompt ===\n');
  const prompt = Prompt.create()
    .role('Expert Senior Engineer')
    .task('Please write a secure login function.')
    .constraint('Include error handling.')
    .constraint('Include error handling.') // Intentional duplicate
    .context('We are using Express and Node.js v18.')
    .output('TypeScript code');

  const compiled = prompt.build();
  console.log(compiled);

  console.log('\n=== 2. Analyzing the Prompt ===\n');
  const report = await analyzePrompt(compiled);
  console.log(`Overall Score: ${report.overallScore}/100`);
  console.log(`Estimated Tokens: ${report.estimatedTokenCount}`);
  console.log(`Weaknesses identified:`);
  report.weaknesses.forEach((w) => console.log(` - ${w}`));

  console.log('\n=== 3. Optimizing the Prompt ===\n');
  const optimized = await optimizePrompt(prompt);
  const optimizedCompiled = optimized.build();
  console.log(optimizedCompiled);

  const optReport = await analyzePrompt(optimizedCompiled);
  console.log(`\nOptimized Score: ${optReport.overallScore}/100`);
  console.log(`Optimized Tokens: ${optReport.estimatedTokenCount}`);
}

main().catch(console.error);
