'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing proactive suggestions to users.
 *
 * The flow analyzes user context (goals, habits, challenges) to recommend relevant resources,
 * mentors, or support circles.
 *
 * @module src/ai/flows/proactive-suggestions
 *
 * @typedef {Object} ProactiveSuggestionsInput
 * @property {string} userGoals - A description of the user's goals.
 * @property {string} userHabits - A description of the user's habits.
 * @property {string} userChallenges - A description of the user's challenges.
 *
 * @typedef {Object} ProactiveSuggestionsOutput
 * @property {string[]} suggestions - An array of proactive suggestions tailored to the user's context.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProactiveSuggestionsInputSchema = z.object({
  userGoals: z.string().describe("A description of the user's goals."),
  userHabits: z.string().describe("A description of the user's habits."),
  userChallenges: z.string().describe("A description of the user's challenges."),
});

export type ProactiveSuggestionsInput = z.infer<
  typeof ProactiveSuggestionsInputSchema
>;

const ProactiveSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'An array of proactive suggestions tailored to the user\'s context.'
    ),
});

export type ProactiveSuggestionsOutput = z.infer<
  typeof ProactiveSuggestionsOutputSchema
>;

export async function getProactiveSuggestions(
  input: ProactiveSuggestionsInput
): Promise<ProactiveSuggestionsOutput> {
  return proactiveSuggestionsFlow(input);
}

const proactiveSuggestionsPrompt = ai.definePrompt({
  name: 'proactiveSuggestionsPrompt',
  input: {schema: ProactiveSuggestionsInputSchema},
  output: {schema: ProactiveSuggestionsOutputSchema},
  prompt: `Based on the user's goals, habits, and challenges, provide a list of proactive suggestions.

User Goals: {{{userGoals}}}
User Habits: {{{userHabits}}}
User Challenges: {{{userChallenges}}}

Suggestions:`, // Keep as a list of strings.
});

const proactiveSuggestionsFlow = ai.defineFlow(
  {
    name: 'proactiveSuggestionsFlow',
    inputSchema: ProactiveSuggestionsInputSchema,
    outputSchema: ProactiveSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await proactiveSuggestionsPrompt(input);
    return output!;
  }
);
