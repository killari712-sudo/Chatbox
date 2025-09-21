
"use server";

import { moodBasedResponse } from "@/ai/flows/mood-based-response";
import { inputSuggestionAlternatives } from "@/ai/flows/input-suggestion-alternatives";
import { analyzeMoodAndSuggestResources } from "@/ai/flows/mood-tracking-and-ui-adaptation";
import { getProactiveSuggestions } from "@/ai/flows/proactive-suggestions";
import { getNutritionInfo as getNutritionInfoFlow } from "@/ai/flows/nutrition-analysis";
import { summarizeText as summarizeTextFlow } from "@/ai/flows/summarize-text";
import { z } from "zod";
import { WellnessMetric } from "@/lib/types";

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

// Mocked wellness data actions
// In a real app, these would interact with a database like Firestore.
const MOCK_USER_ID = "mock-user-123";

let mockDb: { [key: string]: WellnessMetric } = {
    "2024-07-27": { date: "2024-07-27", calories: 450, sleep: 7.5, hydration: 4, heartRate: 72, steps: 8500, mood: 'Happy' },
};

let mockHistory: WellnessMetric[] = [
    { date: "2024-07-21", calories: 300, sleep: 6 },
    { date: "2024-07-22", calories: 420, sleep: 8 },
    { date: "2024-07-23", calories: 350, sleep: 7 },
    { date: "2024-07-24", calories: 500, sleep: 7.5 },
    { date: "2024-07-25", calories: 450, sleep: 6.5 },
    { date: "2024-07-26", calories: 600, sleep: 9 },
    { date: "2024-07-27", calories: 450, sleep: 7.5 },
];


export async function getWellnessData(userId: string) {
    // This is a mock. A real implementation would fetch from Firestore.
    const today = new Date().toISOString().split('T')[0];
    const todayData = mockDb[today] || { date: today, calories: 0, sleep: 0, hydration: 0, heartRate: 70, steps: 0, mood: 'Neutral' };
    
    return {
        metrics: todayData,
        caloriesHistory: mockHistory.map(h => ({ day: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }), kcal: h.calories })),
        sleepHistory: mockHistory.map(h => ({ day: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }), hrs: h.sleep })),
        goals: [{ id: '1', text: 'Drink 8 cups of water', progress: (todayData.hydration || 0) / 8 }, { id: '2', text: 'Walk 10,000 steps', progress: (todayData.steps || 0) / 10000 }],
        moodLogs: [{ name: 'Happy', count: 4 }, { name: 'Calm', count: 2 }, { name: 'Stressed', count: 1 }],
    };
}


export async function updateWellnessMetric(userId: string, metric: Partial<WellnessMetric>) {
    const today = new Date().toISOString().split('T')[0];
    if (!mockDb[today]) {
        mockDb[today] = { date: today, calories: 0, sleep: 0, hydration: 0, heartRate: 70, steps: 0, mood: 'Neutral' };
    }
    mockDb[today] = { ...mockDb[today], ...metric };
    return { success: true, data: mockDb[today] };
}
