import type { PromptAnalyzer, AnalysisReport } from './types';

export class HeuristicAnalyzer implements PromptAnalyzer {
  public async analyze(promptText: string): Promise<AnalysisReport> {
    const text = promptText.trim();
    if (!text) {
      return this.emptyReport();
    }

    const estimatedTokenCount = Math.ceil(text.split(/\s+/).length * 1.3);
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);

    // Heuristics checks
    const vagueWords = ['stuff', 'things', 'somehow', 'maybe', 'perhaps', 'good', 'bad'];
    const vagueWordCount = words.filter((w) => vagueWords.includes(w)).length;
    const ambiguity = Math.min(100, Math.round((vagueWordCount / Math.max(1, words.length)) * 500));

    const hasRole = /role/i.test(text) || text.includes('<role>') || text.includes('## ROLE');
    const hasTask =
      /task|instruction|objective/i.test(text) ||
      text.includes('<task>') ||
      text.includes('## TASK');
    const hasFormat = /format|json|xml|markdown/i.test(text) || text.includes('<format>');
    const hasExamples = /example|input.*output/i.test(text) || text.includes('<example>');

    const missingInformation: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    let clarity = 100 - ambiguity;

    if (!hasRole) missingInformation.push('Persona/Role definition');
    else strengths.push('Defines a clear persona/role.');

    if (!hasTask) {
      missingInformation.push('Explicit task definition');
      weaknesses.push('The primary task is not explicitly isolated.');
      clarity -= 20;
    } else {
      strengths.push('Explicit task isolation.');
    }

    if (!hasFormat) {
      missingInformation.push('Output format guidelines');
      suggestions.push('Specify exactly how you want the output formatted (e.g., JSON, XML).');
    }

    if (!hasExamples) {
      suggestions.push('Adding few-shot examples greatly improves reliability.');
    } else {
      strengths.push('Uses few-shot examples.');
    }

    if (vagueWordCount > 3) {
      weaknesses.push('Contains vague or ambiguous language ("stuff", "maybe").');
      suggestions.push('Replace vague terms with highly specific terminology.');
    }

    clarity = Math.max(0, Math.min(100, clarity));

    // Calculate Readability
    const sentenceCount = text.split(/[.!?]+/).length || 1;
    const avgWordsPerSentence = words.length / sentenceCount;
    let readability = 'Moderate';
    if (avgWordsPerSentence > 25) readability = 'Complex';
    else if (avgWordsPerSentence < 12) readability = 'Easy';

    let overallScore = 100;
    overallScore -= missingInformation.length * 10;
    overallScore -= ambiguity * 0.5;
    overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

    return {
      overallScore,
      readability,
      clarity,
      ambiguity,
      estimatedTokenCount,
      suggestions,
      missingInformation,
      strengths,
      weaknesses,
    };
  }

  private emptyReport(): AnalysisReport {
    return {
      overallScore: 0,
      readability: 'Unknown',
      clarity: 0,
      ambiguity: 100,
      estimatedTokenCount: 0,
      suggestions: ['Provide some prompt text to analyze.'],
      missingInformation: ['Everything'],
      strengths: [],
      weaknesses: ['Prompt is completely empty.'],
    };
  }
}
