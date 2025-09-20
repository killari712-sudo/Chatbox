
"use server";

import { moodBasedResponse } from "@/ai/flows/mood-based-response";
import { inputSuggestionAlternatives } from "@/ai/flows/input-suggestion-alternatives";
import { analyzeMoodAndSuggestResources } from "@/ai/flows/mood-tracking-and-ui-adaptation";
import { getProactiveSuggestions } from "@/ai/flows/proactive-suggestions";
import { getNutritionInfo as getNutritionInfoFlow } from "@/ai/flows/nutrition-analysis";
import { summarizeText as summarizeTextFlow } from "@/ai/flows/summarize-text";
import { z } from "zod";

export async function getChatResponse(userInput: string) {
  try {
    const [moodResponse, suggestions, moodAnalysis] = await Promise.all([
      moodBasedResponse({ userInput }),
      inputSuggestionAlternatives({ text: userInput }),
      analyzeMoodAndSuggestResources({ userInput }),
    ]);

    return {
      aiResponse: moodResponse.aiResponse,
      suggestions: suggestions.suggestions,
      mood: moodAnalysis.mood.toLowerCase(),
      resources: moodAnalysis.suggestedResources,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get response from AI." };
  }
}


const proactiveSuggestionsSchema = z.object({
  userGoals: z.string().min(1, 'Cannot be empty'),
  userHabits: z.string().min(1, 'Cannot be empty'),
  userChallenges: z.string().min(1, 'Cannot be empty'),
});

export async function getSuggestions(data: z.infer<typeof proactiveSuggestionsSchema>) {
    try {
        const validatedData = proactiveSuggestionsSchema.parse(data);
        const result = await getProactiveSuggestions(validatedData);
        return { suggestions: result.suggestions };
    } catch(error) {
        console.error(error);
        if (error instanceof z.ZodError) {
          return { error: "Please fill out all fields." };
        }
        return { error: "Failed to get suggestions." };
    }
}

export async function getNutritionInfo(foodItem: string) {
    try {
        const result = await getNutritionInfoFlow({ foodItem });
        return { nutritionData: result.nutritionData };
    } catch (error) {
        console.error("Error in getNutritionInfo action:", error);
        return { error: "Failed to get nutrition information from AI." };
    }
}

export async function getSummary(text: string) {
    if (!text.trim()) {
        return { summary: "" };
    }
    try {
        const result = await summarizeTextFlow({ text });
        return { summary: result.summary };
    } catch (error) {
        console.error("Error in getSummary action:", error);
        return { error: "Failed to get summary from AI." };
    }
}

export async function analyzeMood(userInput: string) {
    try {
        const result = await analyzeMoodAndSuggestResources({ userInput });
        return { mood: result.mood, suggestedResources: result.suggestedResources };
    } catch (error) {
        console.error("Error in analyzeMood action:", error);
        return { error: "Failed to analyze mood from AI." };
    }
}
