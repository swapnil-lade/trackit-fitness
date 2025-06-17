
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { FITNESS_STATS_DATA } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart as LucideLineChartIcon, CheckSquare, PlusCircle, CalendarDays, PieChart as LucidePieChart } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie, PieChart as RechartsPieChart, Cell, LineChart } from "recharts";
import React, { useState, useEffect } from "react";

const initialDailyProgressData = [
  { day: "Mon", calories: 0, workout: 0 },
  { day: "Tue", calories: 0, workout: 0 },
  { day: "Wed", calories: 0, workout: 0 },
  { day: "Thu", calories: 0, workout: 0 },
  { day: "Fri", calories: 0, workout: 0 },
  { day: "Sat", calories: 0, workout: 0 },
  { day: "Sun", calories: 0, workout: 0 },
];

const initialMacroData = [
  { name: 'Protein', value: 0, target: 160, fill: 'hsl(var(--chart-1))' },
  { name: 'Carbs', value: 0, target: 250, fill: 'hsl(var(--chart-2))' },
  { name: 'Fat', value: 0, target: 70, fill: 'hsl(var(--chart-3))' },
];
const chartConfig = {
  calories: { label: "Calories", color: "hsl(var(--chart-1))" },
  workout: { label: "Workout (min)", color: "hsl(var(--chart-3))" },
};

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [greeting, setGreeting] = useState("Good Morning");
  const [dailyProgressData, setDailyProgressData] = useState(initialDailyProgressData);
  const [macroData, setMacroData] = useState(initialMacroData);


  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">{greeting}, User!</h1>
          <p className="text-muted-foreground">Here's your fitness snapshot for today.</p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/dashboard/daily-schedule">
            <PlusCircle className="mr-2 h-4 w-4" /> Add to Schedule
          </Link>
        </Button>
      </div>

      {/* Fitness Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* Adjusted for 3 stats */}
        {FITNESS_STATS_DATA.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <LucideLineChartIcon className="h-6 w-6 mr-2 text-primary" /> Weekly Activity
            </CardTitle>
            <CardDescription>Your calories and workout duration over the last week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={dailyProgressData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Legend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="calories" stroke="var(--color-calories)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="workout" stroke="var(--color-workout)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <CalendarDays className="h-6 w-6 mr-2 text-primary" /> Calendar 
            </CardTitle>
            <CardDescription>Your upcoming events and logged activities.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Macronutrient Goals */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <LucidePieChart className="h-6 w-6 mr-2 text-primary" /> Daily Macros
            </CardTitle>
            <CardDescription>Your progress towards daily macronutrient targets.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
             <ChartContainer config={{}} className="h-[200px] w-full">
              <RechartsPieChart>
                <Pie data={macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                   {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend content={<ChartLegendContent />} />
              </RechartsPieChart>
            </ChartContainer>
            <div className="space-y-3">
              {macroData.map((macro) => (
                <div key={macro.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{macro.name}</span>
                    <span className="text-sm text-muted-foreground">{macro.value}g / {macro.target}g</span>
                  </div>
                  <Progress value={(macro.target > 0 ? (macro.value / macro.target) * 100 : 0)} className="h-2 [&>div]:bg-[var(--chart-color)]"
                  style={{'--chart-color': macro.fill} as React.CSSProperties}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
               <CheckSquare className="h-6 w-6 mr-2 text-primary" /> Quick Actions
            </CardTitle>
            <CardDescription>Quickly access common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild><Link href="/dashboard/workout-plans">Log Workout</Link></Button>
            <Button variant="outline" asChild><Link href="/dashboard/diet-planner">Log Meal</Link></Button>
            <Button variant="outline" asChild><Link href="/dashboard/workout-plans">View Plans</Link></Button>
            <Button variant="outline" asChild><Link href="/dashboard/daily-schedule">View Schedule</Link></Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
