'use server';

/**
 * @fileOverview A Q&A flow that answers questions about you based on a Google Doc.
 *
 * - qna - A function that handles the Q&A process.
 * - QnaInput - The input type for the qna function.
 * - QnaOutput - The return type for the qna function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getGoogleDoc} from '@/services/docs-service';

const QnaInputSchema = z.object({
  question: z.string().describe('The question to ask.'),
});
export type QnaInput = z.infer<typeof QnaInputSchema>;

const QnaOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type QnaOutput = z.infer<typeof QnaOutputSchema>;

export async function qna(input: QnaInput): Promise<QnaOutput> {
  return qnaFlow(input);
}

const aboutMeTool = ai.defineTool(
  {
    name: 'aboutMeTool',
    description:
      'A tool that provides information about you from a Google Doc.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'A query to search for in the Google Doc to answer a question.'
        ),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    return await getGoogleDoc();
  }
);

const prompt = ai.definePrompt({
  name: 'qnaPrompt',
  input: {schema: QnaInputSchema},
  output: {schema: QnaOutputSchema},
  tools: [aboutMeTool],
  prompt: `You are a helpful assistant that answers questions about a person from their provided Google Doc.
  
Question: {{{question}}}
`,
});

const qnaFlow = ai.defineFlow(
  {
    name: 'qnaFlow',
    inputSchema: QnaInputSchema,
    outputSchema: QnaOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
