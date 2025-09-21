
'use server';

/**
 * @fileOverview Provides a random wellness fact using generative AI.
 *
 * - getWellnessFact - A function that returns a single wellness fact.
 * - WellnessFactOutput - The return type for the getWellnessFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WellnessFactOutputSchema = z.object({
  fact: z.string().describe('A single, interesting, and concise wellness fact.'),
});
export type WellnessFactOutput = z.infer<typeof WellnessFactOutputSchema>;

export async function getWellnessFact(): Promise<WellnessFactOutput> {
  return getWellnessFactFlow();
}

const prompt = ai.definePrompt({
  name: 'wellnessFactPrompt',
  output: {schema: WellnessFactOutputSchema},
  prompt: `Provide a single, interesting, and concise wellness fact. The fact should be easy to understand and encouraging.`,
});

const getWellnessFactFlow = ai.defineFlow(
  {
    name: 'getWellnessFactFlow',
    outputSchema: WellnessFactOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
