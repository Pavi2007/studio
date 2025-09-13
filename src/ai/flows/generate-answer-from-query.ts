'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating answers to user questions about a PDF document.
 *
 * - generateAnswerFromQuery - A function that accepts a question and document ID, retrieves relevant document chunks from a vector store, and generates an answer using an LLM.
 * - GenerateAnswerFromQueryInput - The input type for the generateAnswerFromQuery function.
 * - GenerateAnswerFromQueryOutput - The return type for the generateAnswerFromQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerFromQueryInputSchema = z.object({
  question: z.string().describe('The question to answer about the document.'),
  documentId: z.string().describe('The ID of the document in the vector store.'),
});
export type GenerateAnswerFromQueryInput = z.infer<typeof GenerateAnswerFromQueryInputSchema>;

const GenerateAnswerFromQueryOutputSchema = z.object({
  answer: z.string().describe('The generated answer to the question.'),
});
export type GenerateAnswerFromQueryOutput = z.infer<typeof GenerateAnswerFromQueryOutputSchema>;

export async function generateAnswerFromQuery(input: GenerateAnswerFromQueryInput): Promise<GenerateAnswerFromQueryOutput> {
  return generateAnswerFromQueryFlow(input);
}

const getRelevantDocumentChunks = ai.defineTool({
  name: 'getRelevantDocumentChunks',
  description: 'Retrieves relevant chunks of text from a vector store, given a document ID and a question.',
  inputSchema: z.object({
    documentId: z.string().describe('The ID of the document in the vector store.'),
    question: z.string().describe('The question to use for retrieval.'),
  }),
  outputSchema: z.array(z.string()),
}, async (input) => {
  // TODO: Implement retrieval from the vector store and return relevant chunks.
  // This is a placeholder implementation.
  return [`This is a relevant chunk from document ${input.documentId} that might answer the question: ${input.question}`];
});

const answerQuestionPrompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: GenerateAnswerFromQueryInputSchema},
  output: {schema: GenerateAnswerFromQueryOutputSchema},
  tools: [getRelevantDocumentChunks],
  prompt: `You are an AI assistant helping users understand documents.  The user will provide a question, and a document ID.  Use the getRelevantDocumentChunks tool to retrieve relevant chunks from the document, then answer the user's question using those chunks as context.  If the document chunks do not contain an answer to the question, respond that you cannot answer the question with the information available.\n\nQuestion: {{{question}}}\nDocument ID: {{{documentId}}}`,
});

const generateAnswerFromQueryFlow = ai.defineFlow(
  {
    name: 'generateAnswerFromQueryFlow',
    inputSchema: GenerateAnswerFromQueryInputSchema,
    outputSchema: GenerateAnswerFromQueryOutputSchema,
  },
  async input => {
    const {output} = await answerQuestionPrompt(input);
    return output!;
  }
);
