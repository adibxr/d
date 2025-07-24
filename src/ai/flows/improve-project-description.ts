'use server';

/**
 * @fileOverview A flow that uses AI to suggest improvements to project descriptions.
 *
 * - improveProjectDescription - A function that handles the project description improvement process.
 * - ImproveProjectDescriptionInput - The input type for the improveProjectDescription function.
 * - ImproveProjectDescriptionOutput - The return type for the improveProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveProjectDescriptionInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('The current description of the project.'),
});
export type ImproveProjectDescriptionInput = z.infer<
  typeof ImproveProjectDescriptionInputSchema
>;

const ImproveProjectDescriptionOutputSchema = z.object({
  improvedDescription: z
    .string()
    .describe('The improved description of the project.'),
  suggestedTagline: z
    .string()
    .optional()
    .describe('A suggested tagline for the project.'),
});
export type ImproveProjectDescriptionOutput = z.infer<
  typeof ImproveProjectDescriptionOutputSchema
>;

export async function improveProjectDescription(
  input: ImproveProjectDescriptionInput
): Promise<ImproveProjectDescriptionOutput> {
  return improveProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveProjectDescriptionPrompt',
  input: {schema: ImproveProjectDescriptionInputSchema},
  output: {schema: ImproveProjectDescriptionOutputSchema},
  prompt: `You are an expert marketing assistant. You will be provided a project description and will improve it to be more engaging and effective. You can also suggest a tagline for the project if appropriate.

Project Description: {{{projectDescription}}}
`,
});

const improveProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'improveProjectDescriptionFlow',
    inputSchema: ImproveProjectDescriptionInputSchema,
    outputSchema: ImproveProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
