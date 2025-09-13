'use server';

import { generateAnswerFromQuery } from '@/ai/flows/generate-answer-from-query';
import { highlightRelevantPassages } from '@/ai/flows/highlight-relevant-passages';
import { z } from 'zod';

const AskQuestionSchema = z.object({
  query: z.string().min(1, { message: 'Query cannot be empty.' }),
  documentId: z.string().min(1, { message: 'A document must be selected.' }),
});

export async function askQuestion(formData: FormData) {
  try {
    const parsed = AskQuestionSchema.parse({
      query: formData.get('query'),
      documentId: formData.get('documentId'),
    });

    const { query, documentId } = parsed;

    // 1. Generate the answer using the provided Genkit flow.
    const answerResult = await generateAnswerFromQuery({ question: query, documentId });
    if (!answerResult || !answerResult.answer) {
      throw new Error('Failed to generate an answer from the AI model.');
    }
    const { answer } = answerResult;
    
    // Simulate a network delay to make loading animations more apparent.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 2. Highlight relevant passages based on the answer.
    const highlightResult = await highlightRelevantPassages({ documentId, query, answer });
    
    // The provided flow is a placeholder, so we supplement with mock data for a better demo.
    const highlightedPassages = highlightResult?.highlightedPassages?.length
      ? highlightResult.highlightedPassages
      : [
          "This is a placeholder for a relevant passage from the source document.",
          "In a real application, this would be an exact quote from the PDF that supports the generated answer."
        ];

    return {
      success: true,
      answer,
      highlightedPassages,
    };
  } catch (error) {
    console.error('Error in askQuestion action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Failed to process question. ${errorMessage}`,
    };
  }
}
