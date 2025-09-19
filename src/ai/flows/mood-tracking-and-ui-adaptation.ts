'use server';
/**
 * @fileOverview Analyzes user input to detect emotional state and suggests resources.
 *
 * - analyzeMoodAndSuggestResources - A function that analyzes user input and returns the detected mood and suggested resources.
 * - MoodTrackingInput - The input type for the analyzeMoodAndSuggestResources function.
 * - MoodTrackingOutput - The return type for the analyzeMoodAndSuggestResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodTrackingInputSchema = z.object({
  userInput: z
    .string()
    .describe('The text input from the user to be analyzed.'),
});
export type MoodTrackingInput = z.infer<typeof MoodTrackingInputSchema>;

const MoodTrackingOutputSchema = z.object({
  mood: z
    .string()
    .describe(
      'The detected mood of the user, such as happy, sad, angry, or neutral.'
    ),
  suggestedResources: z
    .string()
    .describe(
      'Suggested resources tailored to the user’s detected mood, such as links to calming music, mental health exercises, or support forums.'
    ),
});
export type MoodTrackingOutput = z.infer<typeof MoodTrackingOutputSchema>;

export async function analyzeMoodAndSuggestResources(
  input: MoodTrackingInput
): Promise<MoodTrackingOutput> {
  return analyzeMoodAndSuggestResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodTrackingPrompt',
  input: {schema: MoodTrackingInputSchema},
  output: {schema: MoodTrackingOutputSchema},
  prompt: `You are an AI assistant that analyzes the mood of the user from their text input and provides relevant resources.

Analyze the following user input:

{{userInput}}

Based on the input, determine the user's mood and suggest resources that would be helpful to them. Return the mood and suggested resources in the output schema format. 

Make the resources very specific and relevant to the mood.`,
});

const analyzeMoodAndSuggestResourcesFlow = ai.defineFlow(
  {
    name: 'analyzeMoodAndSuggestResourcesFlow',
    inputSchema: MoodTrackingInputSchema,
    outputSchema: MoodTrackingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
