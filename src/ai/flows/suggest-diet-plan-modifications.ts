'use server';
/**
 * @fileOverview AI agent that suggests modifications to a user's diet plan based on logged meals, calorie intake, and fitness goals.
 *
 * - suggestDietPlanModifications - A function that suggests modifications to a diet plan.
 * - SuggestDietPlanModificationsInput - The input type for the suggestDietPlanModifications function.
 * - SuggestDietPlanModificationsOutput - The return type for the suggestDietPlanModifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDietPlanModificationsInputSchema = z.object({
  loggedMeals: z
    .string()
    .describe('A list of the user\'s logged meals for the day, including meal names and descriptions.'),
  calorieIntake: z
    .number()
    .describe('The user\'s total calorie intake for the day.'),
  fitnessGoals: z
    .string()
    .describe('The user\'s fitness goals, including target macros and overall objectives.'),
});

export type SuggestDietPlanModificationsInput = z.infer<
  typeof SuggestDietPlanModificationsInputSchema
>;

const SuggestDietPlanModificationsOutputSchema = z.object({
  suggestedModifications: z
    .string()
    .describe('Suggested modifications to the user\'s diet plan, including specific meal recommendations and adjustments to calorie/macro targets.'),
});

export type SuggestDietPlanModificationsOutput = z.infer<
  typeof SuggestDietPlanModificationsOutputSchema
>;

export async function suggestDietPlanModifications(
  input: SuggestDietPlanModificationsInput
): Promise<SuggestDietPlanModificationsOutput> {
  return suggestDietPlanModificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDietPlanModificationsPrompt',
  input: {schema: SuggestDietPlanModificationsInputSchema},
  output: {schema: SuggestDietPlanModificationsOutputSchema},
  prompt: `You are a nutrition and fitness expert. Based on the user's logged meals, calorie intake, and fitness goals, suggest modifications to their diet plan.

Logged Meals: {{{loggedMeals}}}
Calorie Intake: {{{calorieIntake}}}
Fitness Goals: {{{fitnessGoals}}}

Suggest specific meal recommendations and adjustments to calorie/macro targets to help the user improve their nutrition and reach their fitness goals.`,
});

const suggestDietPlanModificationsFlow = ai.defineFlow(
  {
    name: 'suggestDietPlanModificationsFlow',
    inputSchema: SuggestDietPlanModificationsInputSchema,
    outputSchema: SuggestDietPlanModificationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
