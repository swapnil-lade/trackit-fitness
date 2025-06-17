"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutSuggestionForm } from "./components/workout-suggestion-form";
import { DietSuggestionForm } from "./components/diet-suggestion-form";
import { Wand2, Brain } from "lucide-react";

export default function AiSuggestionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">AI-Powered Suggestions</h1>
        <p className="text-muted-foreground">
          Leverage artificial intelligence to optimize your fitness and nutrition plans.
        </p>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md mb-6">
          <TabsTrigger value="workout">
            <Wand2 className="mr-2 h-4 w-4" /> Workout
          </TabsTrigger>
          <TabsTrigger value="diet">
            <Brain className="mr-2 h-4 w-4" /> Diet
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workout">
          <WorkoutSuggestionForm />
        </TabsContent>
        <TabsContent value="diet">
          <DietSuggestionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
