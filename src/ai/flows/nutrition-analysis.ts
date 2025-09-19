
'use server';
/**
 * @fileOverview Analyzes food items to provide nutritional information.
 *
 * - getNutritionInfoFlow - A function that handles the nutrition analysis process.
 * - NutritionAnalysisInput - The input type for the getNutritionInfoFlow function.
 * - NutritionAnalysisOutput - The return type for the getNutritionInfoFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionAnalysisInputSchema = z.object({
  foodItem: z.string().describe('The food item or dish to be analyzed.'),
});
export type NutritionAnalysisInput = z.infer<typeof NutritionAnalysisInputSchema>;

const NutritionDataSchema = z.object({
    label: z.string().describe("The name of the food item."),
    image: z.string().url().describe("A relevant public image URL from sources like Pexels or Unsplash."),
    macros: z.object({
        protein: z.number().describe("Protein in grams."),
        carbs: z.number().describe("Carbohydrates in grams."),
        fat: z.number().describe("Fat in grams."),
    }),
    tags: z.array(z.string()).describe("An array of descriptive tags like 'High Protein', 'Vegan', etc."),
});

const NutritionAnalysisOutputSchema = z.object({
  nutritionData: z.array(NutritionDataSchema).describe("An array of nutritional information for the analyzed food item.")
});
export type NutritionAnalysisOutput = z.infer<typeof NutritionAnalysisOutputSchema>;


export async function getNutritionInfo(
  input: NutritionAnalysisInput
): Promise<NutritionAnalysisOutput> {
  return getNutritionInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nutritionAnalysisPrompt',
  input: {schema: NutritionAnalysisInputSchema},
  output: {schema: NutritionAnalysisOutputSchema},
  prompt: `Analyze the following food item or dish: {{{foodItem}}}. 
  
  Provide a detailed nutritional breakdown. The output must be a JSON array of objects. Each object must have keys "label" (string), "image" (string, a relevant public image URL from sources like Pexels or Unsplash, or a placeholder if not found), "macros" (an object with "protein", "carbs", and "fat" in grams), and a "tags" array of strings (e.g., ["High Protein", "Vegan"]). 
  
  Respond ONLY with the JSON array, do not add any other text, markdown, or commentary.`,
});

const getNutritionInfoFlow = ai.defineFlow(
  {
    name: 'getNutritionInfoFlow',
    inputSchema: NutritionAnalysisInputSchema,
    outputSchema: NutritionAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    