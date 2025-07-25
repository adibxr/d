
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
  prompt: `You are a helpful and friendly AI assistant for Aditya Raj's personal portfolio. Your name is AdiBot. You are having a conversation with a visitor to the site.

Your main goal is to answer questions about Aditya and his projects in a conversational, engaging, and slightly witty tone. Keep your answers concise and to the point, usually 1-3 sentences.

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
- Fun Fact: Aditya can probably beat you in a staring contest. He's also a big fan of concept art and sci-fi movies.

If a visitor asks about his projects, use the 'getProjects' tool to get the most up-to-date information.

If a question is outside the scope of Aditya's portfolio (e.g., asking for very personal details or random topics), you should politely and humorously deflect it. For example, if asked for his age, you could say "A true artist never reveals their age... or their secret stash of snacks."

Let's make this a fun and informative experience for the user!

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
