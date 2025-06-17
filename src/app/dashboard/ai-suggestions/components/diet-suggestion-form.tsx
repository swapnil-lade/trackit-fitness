"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getDietSuggestionsAction } from "../actions";
import type { SuggestDietPlanModificationsOutput } from "@/ai/flows/suggest-diet-plan-modifications";
import { Loader2, Brain, CheckCircle, AlertTriangle } from "lucide-react";

const dietFormSchema = z.object({
  loggedMeals: z.string().min(50, "Please describe your meals in at least 50 characters."),
  calorieIntake: z.coerce.number().min(1, "Calorie intake must be a positive number."),
  fitnessGoals: z.string().min(20, "Please describe your goals in at least 20 characters."),
});

type DietFormValues = z.infer<typeof dietFormSchema>;

export function DietSuggestionForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestDietPlanModificationsOutput | null>(null);

  const form = useForm<DietFormValues>({
    resolver: zodResolver(dietFormSchema),
    defaultValues: {
      loggedMeals: "",
      calorieIntake: 2000,
      fitnessGoals: "",
    },
  });

  async function onSubmit(data: DietFormValues) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getDietSuggestionsAction(data);
      setSuggestions(result);
      toast({
        title: "Suggestions Generated!",
        description: "AI diet modifications are ready.",
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
          <Brain className="mr-2 h-6 w-6 text-primary" /> AI Diet Suggestions
        </CardTitle>
        <CardDescription>
          Receive AI-powered suggestions to fine-tune your diet plan based on your logged meals, calorie intake, and fitness goals.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="loggedMeals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logged Meals (Typical Day)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you typically eat in a day. e.g., 'Breakfast: Oats with berries. Lunch: Chicken salad. Dinner: Salmon and veggies...'"
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
              name="calorieIntake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Daily Calorie Intake</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2200" {...field} disabled={isLoading} />
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
                  <FormLabel>Dietary & Fitness Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Lose 1kg per week while maintaining muscle', 'Increase protein intake to 150g/day', 'Reduce sugar consumption.'"
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
                  <Brain className="mr-2 h-4 w-4" /> Get Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {suggestions && (
        <div className="p-6 border-t">
          <h3 className="font-headline text-lg mb-2">Suggested Diet Modifications:</h3>
          <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{suggestions.suggestedModifications}</p>
        </div>
      )}
    </Card>
  );
}
