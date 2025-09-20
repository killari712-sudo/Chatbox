'use server';

/**
 * @fileOverview A mood-based response AI agent.
 *
 * - moodBasedResponse - A function that handles generating responses based on user mood.
 * - MoodBasedResponseInput - The input type for the moodBasedResponse function.
 * - MoodBasedResponseOutput - The return type for the moodBasedResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getCurrentDate} from '@/ai/tools/date';

const MoodBasedResponseInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input text to analyze for mood and generate a response.'),
});
export type MoodBasedResponseInput = z.infer<typeof MoodBasedResponseInputSchema>;

const MoodBasedResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI response adapted to the user mood.'),
  sentiment: z.string().describe('The sentiment of the user input (e.g., positive, negative, neutral).'),
});
export type MoodBasedResponseOutput = z.infer<typeof MoodBasedResponseOutputSchema>;

export async function moodBasedResponse(input: MoodBasedResponseInput): Promise<MoodBasedResponseOutput> {
  return moodBasedResponseFlow(input);
}

const analyzeSentimentPrompt = ai.definePrompt({
  name: 'analyzeSentimentPrompt',
  input: {schema: z.object({text: z.string()})},
  output: {schema: z.object({sentiment: z.string().describe('The sentiment of the text.')})},
  prompt: `What is the sentiment of this text? Return one of the following values: positive, negative, or neutral.

Text: {{{text}}}`,
});

const generateResponsePrompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  tools: [getCurrentDate],
  input: {
    schema: z.object({
      userInput: z.string(),
      sentiment: z.string(),
    }),
  },
  output: {schema: MoodBasedResponseOutputSchema},
  prompt: `You are an AI assistant that responds to user input with a tone appropriate to their mood.
If the user asks for the current date, use the provided tool to get it.

User Input: {{{userInput}}}

User Sentiment: {{{sentiment}}}

Respond to the user input in a way that is appropriate for the detected sentiment.`,
});

const moodBasedResponseFlow = ai.defineFlow(
  {
    name: 'moodBasedResponseFlow',
    inputSchema: MoodBasedResponseInputSchema,
    outputSchema: MoodBasedResponseOutputSchema,
  },
  async input => {
    const sentimentAnalysisResult = await analyzeSentimentPrompt({
      text: input.userInput,
    });
    const sentiment = sentimentAnalysisResult.output!.sentiment;

    const responseGenerationResult = await generateResponsePrompt({
      userInput: input.userInput,
      sentiment: sentiment,
    });

    return {
      aiResponse: responseGenerationResult.output!.aiResponse,
      sentiment: sentiment,
    };
  }
);
