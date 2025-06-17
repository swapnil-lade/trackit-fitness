"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getWorkoutSuggestionsAction } from "../actions";
import type { SuggestWorkoutModificationsOutput } from "@/ai/flows/suggest-workout-modifications";
import { Loader2, Wand2, CheckCircle, AlertTriangle } from "lucide-react";

const workoutFormSchema = z.object({
  workoutRoutine: z.string().min(50, "Please describe your routine in at least 50 characters."),
  recentProgress: z.string().min(30, "Please describe your progress in at least 30 characters."),
  fitnessGoals: z.string().min(20, "Please describe your goals in at least 20 characters."),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

export function WorkoutSuggestionForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestWorkoutModificationsOutput | null>(null);

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      workoutRoutine: "",
      recentProgress: "",
      fitnessGoals: "",
    },
  });

  async function onSubmit(data: WorkoutFormValues) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getWorkoutSuggestionsAction(data);
      setSuggestions(result);
      toast({
        title: "Suggestions Generated!",
        description: "AI workout modifications are ready.",
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Error Generating Suggestions",
        description: errorMessage,
        action: <AlertTriangle className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" /> AI Workout Suggestions
        </CardTitle>
        <CardDescription>
          Get personalized workout modification suggestions from our AI based on your current routine, progress, and goals.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="workoutRoutine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Workout Routine</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your current weekly workout split, exercises, sets, reps, etc."
                      rows={5}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recentProgress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Progress & Challenges</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Increased bench press by 5kg, but struggling with pull-up consistency. Feeling fatigued on leg days.'"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fitnessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Fitness Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Gain 5kg of muscle in 3 months', 'Run a 5k in under 25 minutes', 'Improve overall strength and endurance.'"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Get Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {suggestions && (
        <div className="p-6 border-t">
          <h3 className="font-headline text-lg mb-2">Suggested Modifications:</h3>
          <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{suggestions.suggestedModifications}</p>
          <h3 className="font-headline text-lg mt-4 mb-2">Reasoning:</h3>
          <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{suggestions.reasoning}</p>
        </div>
      )}
    </Card>
  );
}
