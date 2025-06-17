
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit3, Trash2, Dumbbell, CalendarDays, Target, Repeat, Clock, Eye } from "lucide-react";
import { SAMPLE_WORKOUT_PLANS, WORKOUT_EXERCISES_SAMPLE } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  duration: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  daysPerWeek: number;
  goal: string;
  description?: string;
  exercises?: { day: string, items: Exercise[] }[];
}

export default function WorkoutPlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>(SAMPLE_WORKOUT_PLANS.map(p => ({...p, daysPerWeek: p.days, exercises: [{day: 'Day 1', items: WORKOUT_EXERCISES_SAMPLE}]})));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<WorkoutPlan | null>(null);

  // Form state for creating/editing plan
  const [planName, setPlanName] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');


  const handleOpenModal = (plan: WorkoutPlan | null = null) => {
    setCurrentPlan(plan);
    if (plan) {
      setPlanName(plan.name);
      setDaysPerWeek(plan.daysPerWeek);
      setGoal(plan.goal);
      setDescription(plan.description || '');
    } else {
      setPlanName('');
      setDaysPerWeek(3);
      setGoal('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSavePlan = () => {
    if (currentPlan) {
      setPlans(plans.map(p => p.id === currentPlan.id ? { ...p, name: planName, daysPerWeek, goal, description } : p));
    } else {
      const newPlan: WorkoutPlan = { 
        id: `plan${plans.length + 1}`, 
        name: planName, 
        daysPerWeek, 
        goal, 
        description,
        exercises: [{day: 'Day 1', items: []}] // Initialize with one day
      };
      setPlans([...plans, newPlan]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
  };

  const handleViewPlan = (plan: WorkoutPlan) => {
    setViewingPlan(plan);
    setIsViewModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Workout Plans</h1>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="font-headline">No Workout Plans Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Start by creating your first personalized workout plan.</p>
            <Button onClick={() => handleOpenModal()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{plan.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <Target className="h-4 w-4 mr-1 text-primary" /> {plan.goal || 'Not specified'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" /> {plan.daysPerWeek} days/week
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {plan.description || 'No description available.'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewPlan(plan)}>
                  <Eye className="mr-1 h-4 w-4" /> View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleOpenModal(plan)}>
                  <Edit3 className="mr-1 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Plan Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{currentPlan ? 'Edit Workout Plan' : 'Create New Workout Plan'}</DialogTitle>
            <DialogDescription>
              {currentPlan ? 'Update the details of your workout plan.' : 'Fill in the details to create a new workout plan.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="planName" className="text-right">Name</Label>
              <Input id="planName" value={planName} onChange={(e) => setPlanName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="daysPerWeek" className="text-right">Days/Week</Label>
              <Input id="daysPerWeek" type="number" value={daysPerWeek} onChange={(e) => setDaysPerWeek(parseInt(e.target.value))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal" className="text-right">Goal</Label>
               <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                  <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Endurance">Endurance</SelectItem>
                  <SelectItem value="Wellness">General Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Optional: Describe your plan..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePlan}>Save Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Plan Modal */}
      {viewingPlan && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">{viewingPlan.name}</DialogTitle>
              <DialogDescription>
                Goal: {viewingPlan.goal} | {viewingPlan.daysPerWeek} days/week
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
              <p className="text-sm text-muted-foreground">{viewingPlan.description}</p>
              {viewingPlan.exercises && viewingPlan.exercises.map((dayExercises, index) => (
                <div key={index}>
                  <h3 className="font-headline text-lg mt-4 mb-2 border-b pb-1">{dayExercises.day}</h3>
                  {dayExercises.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No exercises added for this day yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {dayExercises.items.map(ex => (
                        <li key={ex.id} className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">{ex.name}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                            {ex.sets > 0 && <span className="flex items-center"><Repeat className="h-3 w-3 mr-1"/> Sets: {ex.sets}</span>}
                            {ex.reps && <span className="flex items-center"><Dumbbell className="h-3 w-3 mr-1"/> Reps: {ex.reps}</span>}
                            {ex.duration && <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> Duration: {ex.duration}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                   <Button variant="outline" size="sm" className="mt-2">
                    <PlusCircle className="mr-1 h-3 w-3" /> Add Exercise to {dayExercises.day}
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsViewModalOpen(false); setViewingPlan(null);}}>Close</Button>
              <Button onClick={() => { handleOpenModal(viewingPlan); setIsViewModalOpen(false); }}>Edit Plan Details</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
