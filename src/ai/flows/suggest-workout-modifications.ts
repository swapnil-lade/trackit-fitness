// 'use server';

/**
 * @fileOverview Workout modification suggestion flow.
 *
 * - suggestWorkoutModifications - A function that suggests modifications to a workout routine based on user progress.
 * - SuggestWorkoutModificationsInput - The input type for the suggestWorkoutModifications function.
 * - SuggestWorkoutModificationsOutput - The return type for the suggestWorkoutModifications function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestWorkoutModificationsInputSchema = z.object({
  workoutRoutine: z.string().describe('The user\'s current workout routine.'),
  recentProgress: z.string().describe('The user\'s recent workout progress and performance data.'),
  fitnessGoals: z.string().describe('The user\'s fitness goals.'),
});

export type SuggestWorkoutModificationsInput = z.infer<typeof SuggestWorkoutModificationsInputSchema>;

// Define the output schema
const SuggestWorkoutModificationsOutputSchema = z.object({
  suggestedModifications: z.string().describe('Suggestions for modifying the workout routine.'),
  reasoning: z.string().describe('The reasoning behind the suggested modifications.'),
});

export type SuggestWorkoutModificationsOutput = z.infer<typeof SuggestWorkoutModificationsOutputSchema>;

// Define the tool to analyze workout data
const analyzeWorkoutData = ai.defineTool({
  name: 'analyzeWorkoutData',
  description: 'Analyzes workout progress and performance data to identify areas for improvement.',
  inputSchema: z.object({
    workoutRoutine: z.string().describe('The user\'s current workout routine.'),
    recentProgress: z.string().describe('The user\'s recent workout progress and performance data.'),
    fitnessGoals: z.string().describe('The user\'s fitness goals.'),
  }),
  outputSchema: z.string().describe('A detailed analysis of the workout data, highlighting areas for improvement and potential modifications.'),
},
async (input) => {
    // Placeholder for workout data analysis logic
    // In a real application, this would involve analyzing the data to identify trends,
    // areas where the user is making progress, and areas where they are plateauing.
    // For now, we'll just return a generic analysis.
    return `Based on the provided data, the user is making good progress with their strength training but needs to improve their cardio.`;
  }
);

// Define the prompt
const suggestWorkoutModificationsPrompt = ai.definePrompt({
  name: 'suggestWorkoutModificationsPrompt',
  input: {schema: SuggestWorkoutModificationsInputSchema},
  output: {schema: SuggestWorkoutModificationsOutputSchema},
  tools: [analyzeWorkoutData],
  prompt: `You are a personal trainer. You must suggest modifications to a workout routine based on the user's recent progress and performance data, taking into account their fitness goals.

  First, you will use the analyzeWorkoutData tool to analyze the workout data and identify areas for improvement.

  Then, you will provide specific and actionable suggestions for modifying the workout routine to optimize training and avoid plateaus. You will also provide a reasoning for your suggestions.

  Workout Routine: {{{workoutRoutine}}}
  Recent Progress: {{{recentProgress}}}
  Fitness Goals: {{{fitnessGoals}}}
  Analysis: {{await analyzeWorkoutData workoutRoutine=workoutRoutine recentProgress=recentProgress fitnessGoals=fitnessGoals}}

  Make sure the response is actionable and concise.

  Here's how you should format your output:
  {
    "suggestedModifications": "...",
    "reasoning": "..."
  }`,
});

// Define the flow
const suggestWorkoutModificationsFlow = ai.defineFlow(
  {
    name: 'suggestWorkoutModificationsFlow',
    inputSchema: SuggestWorkoutModificationsInputSchema,
    outputSchema: SuggestWorkoutModificationsOutputSchema,
  },
  async input => {
    const {output} = await suggestWorkoutModificationsPrompt(input);
    return output!;
  }
);

/**
 * Suggests modifications to a workout routine based on user progress.
 * @param input - The input containing the workout routine, recent progress, and fitness goals.
 * @returns The suggested modifications and reasoning.
 */
export async function suggestWorkoutModifications(input: SuggestWorkoutModificationsInput): Promise<SuggestWorkoutModificationsOutput> {
  return suggestWorkoutModificationsFlow(input);
}
