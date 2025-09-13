'use server';

/**
 * @fileOverview This flow takes a document ID, a query, and an AI-generated answer,
 * and returns the highlighted passages from the document that are most relevant to the answer.
 *
 * - highlightRelevantPassages - The main function to call for highlighting relevant passages.
 * - HighlightRelevantPassagesInput - The input type for the highlightRelevantPassages function.
 * - HighlightRelevantPassagesOutput - The return type for the highlightRelevantPassages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightRelevantPassagesInputSchema = z.object({
  documentId: z.string().describe('The ID of the document to highlight passages in.'),
  query: z.string().describe('The original query from the user.'),
  answer: z.string().describe('The AI-generated answer to the query.'),
});
export type HighlightRelevantPassagesInput = z.infer<
  typeof HighlightRelevantPassagesInputSchema
>;

const HighlightRelevantPassagesOutputSchema = z.object({
  highlightedPassages: z
    .array(z.string())
    .describe(
      'An array of passages from the document that are most relevant to the answer.'
    ),
});
export type HighlightRelevantPassagesOutput = z.infer<
  typeof HighlightRelevantPassagesOutputSchema
>;

export async function highlightRelevantPassages(
  input: HighlightRelevantPassagesInput
): Promise<HighlightRelevantPassagesOutput> {
  return highlightRelevantPassagesFlow(input);
}

const highlightRelevantPassagesPrompt = ai.definePrompt({
  name: 'highlightRelevantPassagesPrompt',
  input: {schema: HighlightRelevantPassagesInputSchema},
  output: {schema: HighlightRelevantPassagesOutputSchema},
  prompt: `Given the following document ID, user query, and AI-generated answer, identify and return the passages from the document that are most relevant to the answer.

Document ID: {{{documentId}}}
User Query: {{{query}}}
AI-Generated Answer: {{{answer}}}

Relevant Passages:`,
});

const highlightRelevantPassagesFlow = ai.defineFlow(
  {
    name: 'highlightRelevantPassagesFlow',
    inputSchema: HighlightRelevantPassagesInputSchema,
    outputSchema: HighlightRelevantPassagesOutputSchema,
  },
  async input => {
    const {output} = await highlightRelevantPassagesPrompt(input);
    return output!;
  }
);
