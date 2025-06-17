import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  CalendarDays,
  Settings,
  LogOut,
  UserCircle,
  Flame,
  Footprints,
  Utensils,
  Bed,
  HeartPulse,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: 'default' | 'ghost';
  subLinks?: NavLink[];
};

export const DASHBOARD_NAV_LINKS: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/workout-plans', label: 'Workout Plans', icon: Dumbbell },
  { href: '/dashboard/diet-planner', label: 'Diet Planner', icon: Apple },
  { href: '/dashboard/daily-schedule', label: 'Daily Schedule', icon: CalendarDays },
];

export const DASHBOARD_SETTINGS_LINKS: NavLink[] = [
 { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
 { href: '/dashboard/settings', label: 'Settings', icon: Settings },
 { href: '#', label: 'Logout', icon: LogOut }, // Placeholder for logout functionality
];

export const FITNESS_STATS_DATA = [
  { title: 'Calories Burned', value: '0', unit: 'kcal', icon: Flame, color: 'text-red-500' },
  { title: 'Current Workout', value: 'N/A', unit: '', icon: Dumbbell, color: 'text-green-500' },
  { title: 'Meals Logged', value: '0', unit: 'meals', icon: Utensils, color: 'text-orange-500' },
];

export const DAILY_SCHEDULE_TASK_TYPES = [
  { label: 'Training', value: 'training', icon: Dumbbell, color: 'bg-blue-500' },
  { label: 'Meal', value: 'meal', icon: Apple, color: 'bg-green-500' },
  { label: 'Rest', value: 'rest', icon: Bed, color: 'bg-purple-500' },
  { label: 'Recovery', value: 'recovery', icon: HeartPulse, color: 'bg-yellow-500' },
  { label: 'Custom', value: 'custom', icon: PlusCircle, color: 'bg-gray-500' },
];

export const SAMPLE_WORKOUT_PLANS = [
  { id: 'plan1', name: 'Full Body Strength', days: 3, goal: 'Muscle Gain' },
  { id: 'plan2', name: 'Cardio Blast', days: 5, goal: 'Weight Loss' },
  { id: 'plan3', name: 'Yoga & Flexibility', days: 7, goal: 'Wellness' },
];

export const SAMPLE_MEALS = [
 { id: 'meal1', name: 'Breakfast Burrito', calories: 450, protein: 30, carbs: 40, fat: 18, type: 'Breakfast'},
 { id: 'meal2', name: 'Grilled Chicken Salad', calories: 550, protein: 50, carbs: 25, fat: 28, type: 'Lunch'},
 { id: 'meal3', name: 'Salmon with Quinoa', calories: 600, protein: 45, carbs: 50, fat: 22, type: 'Dinner'},
 { id: 'snack1', name: 'Apple with Peanut Butter', calories: 250, protein: 8, carbs: 30, fat: 12, type: 'Snack'}
];

export const WORKOUT_EXERCISES_SAMPLE = [
  { id: 'ex1', name: 'Squats', sets: 3, reps: '8-12', duration: '' },
  { id: 'ex2', name: 'Bench Press', sets: 3, reps: '8-12', duration: '' },
  { id: 'ex3', name: 'Deadlifts', sets: 1, reps: '5', duration: '' },
  { id: 'ex4', name: 'Running', sets: 1, reps: '', duration: '30 mins' },
];
