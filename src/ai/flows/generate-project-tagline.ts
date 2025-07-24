'use server';

/**
 * @fileOverview AI-powered project tagline generator.
 *
 * - generateProjectTagline - A function that generates a project tagline.
 * - GenerateProjectTaglineInput - The input type for the generateProjectTagline function.
 * - GenerateProjectTaglineOutput - The return type for the generateProjectTagline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectTaglineInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDescription: z.string().describe('A detailed description of the project.'),
});
export type GenerateProjectTaglineInput = z.infer<typeof GenerateProjectTaglineInputSchema>;

const GenerateProjectTaglineOutputSchema = z.object({
  tagline: z.string().describe('A catchy and concise tagline for the project.'),
});
export type GenerateProjectTaglineOutput = z.infer<typeof GenerateProjectTaglineOutputSchema>;

export async function generateProjectTagline(input: GenerateProjectTaglineInput): Promise<GenerateProjectTaglineOutput> {
  return generateProjectTaglineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectTaglinePrompt',
  input: {schema: GenerateProjectTaglineInputSchema},
  output: {schema: GenerateProjectTaglineOutputSchema},
  prompt: `You are a creative marketing expert specializing in generating catchy taglines for software projects.

  Given the project name and description, generate a concise and engaging tagline that captures the essence of the project.

  Project Name: {{{projectName}}}
  Project Description: {{{projectDescription}}}

  Tagline:`,
});

const generateProjectTaglineFlow = ai.defineFlow(
  {
    name: 'generateProjectTaglineFlow',
    inputSchema: GenerateProjectTaglineInputSchema,
    outputSchema: GenerateProjectTaglineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
