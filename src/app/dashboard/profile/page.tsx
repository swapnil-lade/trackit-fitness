"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit3, Mail, CalendarDays, MapPin, Target, ShieldCheck, UserCircle } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
            <h1 className="text-3xl font-headline font-bold flex items-center">
                <UserCircle className="mr-3 h-8 w-8 text-primary" /> My Profile
            </h1>
            <p className="text-muted-foreground">View and manage your personal information and preferences.</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
                <div className="relative">
                    <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
                        <AvatarImage src="https://placehold.co/200x200.png" alt="User Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute bottom-4 right-0 rounded-full h-8 w-8 bg-background">
                        <Edit3 className="h-4 w-4"/>
                        <span className="sr-only">Edit Avatar</span>
                    </Button>
                </div>
              <CardTitle className="font-headline text-2xl">John Doe</CardTitle>
              <CardDescription>Fitness Enthusiast | Aspiring Marathon Runner</CardDescription>
              <Badge variant="secondary" className="mt-2">Pro Member</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Joined: January 15, 2023</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>New York, USA</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/> Fitness Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <p><Badge variant="outline">Run a full marathon</Badge></p>
                <p><Badge variant="outline">Increase bench press to 100kg</Badge></p>
                <p><Badge variant="outline">Maintain 15% body fat</Badge></p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details and Activity */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Username</Label>
                  <p className="font-medium">johndoe_fit</p>
                </div>
                 <div>
                  <Label>Date of Birth</Label>
                  <p className="font-medium">October 26, 1990</p>
                </div>
              </div>
               <div>
                  <Label>About Me</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    Passionate about all things fitness! I started my journey 5 years ago and haven't looked back. 
                    I love weightlifting, HIIT, and recently started training for marathons. 
                    Always looking to connect with fellow fitness enthusiasts and share tips and motivation.
                  </p>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Recent Activity</CardTitle>
              <CardDescription>A snapshot of your latest achievements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Placeholder for activity feed */}
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                <Image src="https://placehold.co/40x40.png" alt="Workout icon" data-ai-hint="workout icon" width={40} height={40} className="rounded-full"/>
                <div>
                  <p className="text-sm font-medium">Completed: Morning Run - 5km</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                <Image src="https://placehold.co/40x40.png" alt="Meal icon" data-ai-hint="meal food" width={40} height={40} className="rounded-full"/>
                <div>
                  <p className="text-sm font-medium">Logged Meal: Protein Smoothie</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                <Image src="https://placehold.co/40x40.png" alt="Achievement icon" data-ai-hint="badge achievement" width={40} height={40} className="rounded-full"/>
                <div>
                  <p className="text-sm font-medium">Unlocked: "Early Bird" Badge</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto">View all activity</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/> Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm">Password</p>
                    <Button variant="outline" size="sm">Change Password</Button>
                </div>
                 <div className="flex justify-between items-center">
                    <p className="text-sm">Two-Factor Authentication</p>
                    <Badge variant={true ? "default" : "destructive"}>{true ? "Enabled" : "Disabled"}</Badge>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
