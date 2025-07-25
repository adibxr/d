
'use server';
/**
 * @fileOverview An AI agent that can answer questions about Aditya and his projects.
 *
 * - askAboutMe - A function that handles the question answering process.
 * - AskAboutMeInput - The input type for the askAboutMe function.
 * - AskAboutMeOutput - The return type for the askAboutMe function.
 */

import { ai } from '@/ai/genkit';
import { getProjects } from '@/services/project-service';
import { z } from 'genkit';

const AskAboutMeInputSchema = z.object({
  question: z.string().describe('The user\'s question about Aditya or his projects.'),
});
export type AskAboutMeInput = z.infer<typeof AskAboutMeInputSchema>;

const AskAboutMeOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type AskAboutMeOutput = z.infer<typeof AskAboutMeOutputSchema>;

export async function askAboutMe(input: AskAboutMeInput): Promise<AskAboutMeOutput> {
  return askAboutMeFlow(input);
}

const getProjectsTool = ai.defineTool(
  {
    name: 'getProjects',
    description: 'Returns a list of all of Aditya\'s projects, including their titles, descriptions, and technologies used.',
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => {
    return await getProjects();
  }
);

const prompt = ai.definePrompt({
  name: 'askAboutMePrompt',
  input: { schema: AskAboutMeInputSchema },
  output: { schema: AskAboutMeOutputSchema },
  tools: [getProjectsTool],
  prompt: `You are a helpful AI assistant for a personal portfolio website. Your name is AdiBot.
You are representing Aditya Raj, a web developer and digital visual artist.

Your goal is to answer questions from visitors about Aditya and his projects in a friendly, conversational, and slightly professional tone.

Here is some information about Aditya:
- Name: Aditya Raj
- Tagline: Frontend Developer | ReactJS | NextJS | UI/UX Enthusiast
- Bio: "Hi! My name is Aditya. I'm a web developer and digital visual artist. I love creating things that exist on the internet. My interest in web development started in 2021 when I decided to upload my digital concept arts online."
- Contact Email: ccidcop@gmail.com
- Social Links:
  - GitHub: https://github.com/adibxr
  - Twitter: https://twitter.com/adibxr
  - Instagram: https://instagram.com/adi.bxr
  - LinkedIn: https://www.linkedin.com/in/adityasingh-02/

If you need information about his projects to answer a question, use the 'getProjects' tool. The tool will return a list of projects with details like title, description, and tags (technologies).

When answering, be concise and helpful. If a question is unclear or outside the scope of Aditya's portfolio (e.g., asking about personal life details not listed here or random topics), politely decline to answer.

User's Question: {{{question}}}
`,
});

const askAboutMeFlow = ai.defineFlow(
  {
    name: 'askAboutMeFlow',
    inputSchema: AskAboutMeInputSchema,
    outputSchema: AskAboutMeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    