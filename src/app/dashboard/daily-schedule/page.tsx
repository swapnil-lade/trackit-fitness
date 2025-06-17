"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit3, Trash2, Clock, Bell, type LucideIcon } from "lucide-react";
import { DAILY_SCHEDULE_TASK_TYPES } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, setHours, setMinutes, addMinutes, isSameHour, isBefore, startOfHour } from 'date-fns';

interface Task {
  id: string;
  title: string;
  time: string; // HH:mm format
  duration: number; // in minutes
  type: string; // 'training', 'rest', 'recovery', 'meal', 'custom'
  description?: string;
  color?: string;
  icon?: LucideIcon;
}

const hoursOfDay = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

export default function DailySchedulePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('09:00');
  const [taskDuration, setTaskDuration] = useState(60);
  const [taskType, setTaskType] = useState('custom');
  const [taskDescription, setTaskDescription] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleOpenModal = (task: Task | null = null, hour?: number) => {
    setEditingTask(task);
    if (task) {
      setTaskTitle(task.title);
      setTaskTime(task.time);
      setTaskDuration(task.duration);
      setTaskType(task.type);
      setTaskDescription(task.description || '');
    } else {
      setTaskTitle('');
      setTaskTime(hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : '09:00');
      setTaskDuration(60);
      setTaskType('custom');
      setTaskDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    const taskTypeDetails = DAILY_SCHEDULE_TASK_TYPES.find(t => t.value === taskType);
    const newTaskData = {
      title: taskTitle,
      time: taskTime,
      duration: taskDuration,
      type: taskType,
      description: taskDescription,
      color: taskTypeDetails?.color,
      icon: taskTypeDetails?.icon,
    };

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...newTaskData } : t));
    } else {
      setTasks([...tasks, { id: `task-${Date.now()}`, ...newTaskData }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };
  
  const getTaskPositionAndHeight = (task: Task) => {
    const [hour, minute] = task.time.split(':').map(Number);
    const topPosition = (minute / 60) * 100; // Percentage from top of the hour block
    const height = (task.duration / 60) * 100; // Percentage height relative to an hour block
    return { top: `${topPosition}%`, height: `${height}%` };
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Daily Schedule</h1>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <Card className="flex-grow shadow-lg flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline">Today's Plan - {format(currentTime, "eeee, MMMM do")}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 relative">
          <ScrollArea className="h-full absolute inset-0">
            <div className="relative">
              {/* Time Ruler */}
              <div className="absolute left-0 top-0 bottom-0 w-16 text-xs text-right pr-2">
                {hoursOfDay.map(hour => (
                  <div key={`time-${hour}`} className="h-24 border-b flex items-start justify-end pt-1">
                    <span>{format(setHours(new Date(), hour), 'ha')}</span>
                  </div>
                ))}
              </div>

              {/* Schedule Grid */}
              <div className="ml-16"> {/* Margin for time ruler */}
                {hoursOfDay.map(hour => (
                  <div key={`hour-block-${hour}`} className="h-24 border-b relative" onClick={() => handleOpenModal(null, hour)}>
                     {/* Current Time Indicator */}
                    {isSameHour(currentTime, setHours(new Date(), hour)) && (
                      <div 
                        className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                        style={{ top: `${(currentTime.getMinutes() / 60) * 100}%` }}
                      >
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-red-500"></div>
                      </div>
                    )}
                    {/* Tasks for this hour */}
                    {tasks
                      .filter(task => parseInt(task.time.split(':')[0]) === hour)
                      .map(task => {
                        const { top, height } = getTaskPositionAndHeight(task);
                        const TaskIcon = task.icon || Clock;
                        const taskStart = setMinutes(setHours(new Date(), parseInt(task.time.split(':')[0])), parseInt(task.time.split(':')[1]));
                        const taskEnd = addMinutes(taskStart, task.duration);
                        const isUpcoming = isBefore(currentTime, taskEnd) && isBefore(taskStart, addMinutes(currentTime, 30));


                        return (
                          <div
                            key={task.id}
                            className={`absolute left-1 right-1 p-2 rounded-md shadow-sm text-white overflow-hidden cursor-pointer hover:opacity-90 ${task.color || 'bg-primary'}`}
                            style={{ top, height, minHeight: '2rem' }}
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(task); }}
                          >
                            <div className="flex items-center justify-between text-xs font-medium mb-0.5">
                               <div className="flex items-center truncate">
                                <TaskIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{task.title}</span>
                               </div>
                               {isUpcoming && <Bell className="h-3 w-3 text-yellow-300 animate-pulse" />}
                            </div>
                            <p className="text-xs opacity-80 truncate">{task.time} - {format(taskEnd, 'HH:mm')}</p>
                            {task.description && <p className="text-[10px] opacity-70 mt-0.5 truncate">{task.description}</p>}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add/Edit Task Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="taskTitle">Title</Label>
              <Input id="taskTitle" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taskTime">Time</Label>
                <Input id="taskTime" type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="taskDuration">Duration (minutes)</Label>
                <Input id="taskDuration" type="number" value={taskDuration} onChange={(e) => setTaskDuration(parseInt(e.target.value))} step="15" />
              </div>
            </div>
            <div>
              <Label htmlFor="taskType">Type</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {DAILY_SCHEDULE_TASK_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="taskDescription">Description (optional)</Label>
              <Textarea id="taskDescription" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            {editingTask && (
              <Button variant="destructive" onClick={() => { handleDeleteTask(editingTask.id); setIsModalOpen(false);}} className="mr-auto">
                <Trash2 className="mr-2 h-4 w-4"/> Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTask}>Save Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
