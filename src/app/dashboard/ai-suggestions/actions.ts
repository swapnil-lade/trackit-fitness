"use server";

import { suggestWorkoutModifications, type SuggestWorkoutModificationsInput, type SuggestWorkoutModificationsOutput } from '@/ai/flows/suggest-workout-modifications';
import { suggestDietPlanModifications, type SuggestDietPlanModificationsInput, type SuggestDietPlanModificationsOutput } from '@/ai/flows/suggest-diet-plan-modifications';

export async function getWorkoutSuggestionsAction(input: SuggestWorkoutModificationsInput): Promise<SuggestWorkoutModificationsOutput> {
  try {
    const result = await suggestWorkoutModifications(input);
    return result;
  } catch (error) {
    console.error("Error in getWorkoutSuggestionsAction:", error);
    throw new Error("Failed to get workout suggestions. Please try again.");
  }
}

export async function getDietSuggestionsAction(input: SuggestDietPlanModificationsInput): Promise<SuggestDietPlanModificationsOutput> {
  try {
    const result = await suggestDietPlanModifications(input);
    return result;
  } catch (error) {
    console.error("Error in getDietSuggestionsAction:", error);
    throw new Error("Failed to get diet suggestions. Please try again.");
  }
}
