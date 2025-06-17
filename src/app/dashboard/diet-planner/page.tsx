
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit3, Trash2, Apple, Utensils, Droplets, Flame, PieChart as PieChartIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, PieChart as RechartsPieChart, Cell, Legend } from "recharts";


interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

const nutrientTargets = {
  calories: 2200,
  protein: 150, // grams
  carbs: 250, // grams
  fat: 70, // grams
};

const chartConfig = {
  protein: { label: "Protein (g)", color: "hsl(var(--chart-1))" },
  carbs: { label: "Carbs (g)", color: "hsl(var(--chart-2))" },
  fat: { label: "Fat (g)", color: "hsl(var(--chart-3))" },
};

export default function DietPlannerPage() {
  const [loggedMeals, setLoggedMeals] = useState<Meal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);

  // Form state for logging/editing meal
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Snack');

  useEffect(() => {
    const storedMeals = localStorage.getItem('loggedMeals');
    if (storedMeals) {
      try {
        setLoggedMeals(JSON.parse(storedMeals));
      } catch (e) {
        console.error("Failed to parse logged meals from localStorage", e);
        localStorage.removeItem('loggedMeals'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (loggedMeals.length > 0 || localStorage.getItem('loggedMeals')) {
        localStorage.setItem('loggedMeals', JSON.stringify(loggedMeals));
    }
    if (loggedMeals.length === 0 && localStorage.getItem('loggedMeals') && JSON.parse(localStorage.getItem('loggedMeals')!).length > 0) {
        localStorage.removeItem('loggedMeals');
    }
  }, [loggedMeals]);

  const dailyTotals = useMemo(() => {
    return loggedMeals.reduce((acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [loggedMeals]);

  const macroChartData = [
    { name: 'Protein', value: dailyTotals.protein, target: nutrientTargets.protein, fill: chartConfig.protein.color },
    { name: 'Carbs', value: dailyTotals.carbs, target: nutrientTargets.carbs, fill: chartConfig.carbs.color },
    { name: 'Fat', value: dailyTotals.fat, target: nutrientTargets.fat, fill: chartConfig.fat.color },
  ];

  const handleOpenModal = (meal: Meal | null = null) => {
    setCurrentMeal(meal);
    if (meal) {
      setMealName(meal.name);
      setCalories(meal.calories);
      setProtein(meal.protein);
      setCarbs(meal.carbs);
      setFat(meal.fat);
      setMealType(meal.type);
    } else {
      setMealName('');
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
      setMealType('Snack');
    }
    setIsModalOpen(true);
  };

  const handleSaveMeal = () => {
    const mealData = { name: mealName, calories, protein, carbs, fat, type: mealType };
    if (currentMeal) {
      setLoggedMeals(loggedMeals.map(m => m.id === currentMeal.id ? { ...m, ...mealData } : m));
    } else {
      setLoggedMeals([...loggedMeals, { id: `meal${Date.now()}`, ...mealData }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteMeal = (mealId: string) => {
    setLoggedMeals(loggedMeals.filter(m => m.id !== mealId));
  };

  const mealTypes: Meal['type'][] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Diet Planner</h1>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Log Meal
        </Button>
      </div>

      {/* Daily Nutrition Summary */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <PieChartIcon className="mr-2 h-5 w-5 text-primary" /> Daily Nutrition Summary
          </CardTitle>
          <CardDescription>Your total intake for today against your targets.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center">
                <Flame className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <p className="font-medium">Calories</p>
                  <p className="text-xs text-muted-foreground">{dailyTotals.calories} kcal / {nutrientTargets.calories} kcal</p>
                </div>
              </div>
              <Progress value={(nutrientTargets.calories > 0 ? (dailyTotals.calories / nutrientTargets.calories) * 100 : 0)} className="w-1/3 h-2" />
            </div>
             {macroChartData.map(macro => (
              <div key={macro.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                 <div className="flex items-center">
                   <Droplets style={{color: macro.fill}} className={`h-6 w-6 mr-3`} />
                   <div>
                    <p className="font-medium">{macro.name}</p>
                    <p className="text-xs text-muted-foreground">{macro.value}g / {macro.target}g</p>
                   </div>
                 </div>
                <Progress value={(macro.target > 0 ? (macro.value / macro.target) * 100 : 0)} className="w-1/3 h-2" style={{'--progress-color': macro.fill} as React.CSSProperties} />
              </div>
            ))}
          </div>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
              <RechartsPieChart>
                <Pie data={macroChartData.filter(m => m.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {macroChartData.filter(m => m.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend content={<ChartLegendContent />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      

      {/* Logged Meals List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold">Logged Meals</h2>
        {mealTypes.map(type => {
          const mealsOfType = loggedMeals.filter(m => m.type === type);
          if (mealsOfType.length === 0 && type !== 'Snack' && !loggedMeals.some(m => m.type === 'Snack')) return null; 

          return (
            <div key={type}>
              <h3 className="text-xl font-headline font-medium mb-2 border-b pb-1">{type}</h3>
              {mealsOfType.length === 0 ? (
                 <p className="text-sm text-muted-foreground py-4 text-center">No {type.toLowerCase()} logged yet. <Button variant="link" size="sm" onClick={() => { handleOpenModal(); setMealType(type); }} className="p-0 h-auto">Log one now?</Button></p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mealsOfType.map((meal) => (
                  <Card key={meal.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="font-medium text-lg flex items-center">
                        <Utensils className="mr-2 h-5 w-5 text-primary" />{meal.name}
                      </CardTitle>
                      <CardDescription>{meal.calories} kcal</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Protein: {meal.protein}g</p>
                      <p>Carbs: {meal.carbs}g</p>
                      <p>Fat: {meal.fat}g</p>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenModal(meal)}>
                        <Edit3 className="h-4 w-4" /> <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteMeal(meal.id)}>
                        <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              )}
            </div>
          );
        })}
         {loggedMeals.length === 0 && (
          <Card className="text-center py-12">
            <CardHeader>
              <Apple className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="font-headline">No Meals Logged Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Start logging your meals to track your nutrition.</p>
              <Button onClick={() => handleOpenModal()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Log First Meal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Log/Edit Meal Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{currentMeal ? 'Edit Meal' : 'Log New Meal'}</DialogTitle>
            <DialogDescription>
              {currentMeal ? 'Update the details of this meal.' : 'Enter the nutritional information for your meal.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealName" className="text-right">Name</Label>
              <Input id="mealName" value={mealName} onChange={(e) => setMealName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealType" className="text-right">Type</Label>
              <Select value={mealType} onValueChange={(value: Meal['type']) => setMealType(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">Calories (kcal)</Label>
              <Input id="calories" type="number" value={calories} onChange={(e) => setCalories(parseInt(e.target.value) || 0)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protein" className="text-right">Protein (g)</Label>
              <Input id="protein" type="number" value={protein} onChange={(e) => setProtein(parseInt(e.target.value) || 0)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carbs" className="text-right">Carbs (g)</Label>
              <Input id="carbs" type="number" value={carbs} onChange={(e) => setCarbs(parseInt(e.target.value) || 0)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fat" className="text-right">Fat (g)</Label>
              <Input id="fat" type="number" value={fat} onChange={(e) => setFat(parseInt(e.target.value) || 0)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMeal}>Save Meal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
    
