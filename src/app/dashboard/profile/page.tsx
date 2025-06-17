
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
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [userName, setUserName] = useState("User");
  const [userBio, setUserBio] = useState("Fitness Enthusiast | Aspiring Achiever");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [joinDate, setJoinDate] = useState("Not set"); 
  const [location, setLocation] = useState("Not set");
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("Your Name");
  const [dateOfBirth, setDateOfBirth] = useState("Not set");
  const [aboutMe, setAboutMe] = useState("Tell us about yourself!");

  useEffect(() => {
    // In a real app, this data would be fetched from an API
    // For now, if we want to simulate loading user-specific data that might change,
    // it should happen here. But for default placeholders, useState is fine.
    // Example: if joinDate were dynamic based on registration:
    // const fetchedJoinDate = new Date().toLocaleDateString(); 
    // setJoinDate(fetchedJoinDate);
    // However, for "Not set" or static placeholders, direct useState is okay.
  }, []);


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
                        <AvatarFallback>{displayName.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute bottom-4 right-0 rounded-full h-8 w-8 bg-background">
                        <Edit3 className="h-4 w-4"/>
                        <span className="sr-only">Edit Avatar</span>
                    </Button>
                </div>
              <CardTitle className="font-headline text-2xl">{displayName}</CardTitle>
              <CardDescription>{userBio}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>{userEmail}</span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Joined: {joinDate}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>{location}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/> Fitness Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {fitnessGoals.length > 0 ? (
                    fitnessGoals.map((goal, index) => (
                        <p key={index}><Badge variant="outline">{goal}</Badge></p>
                    ))
                ) : (
                    <p className="text-muted-foreground">No fitness goals set yet.</p>
                )}
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
                  <p className="font-medium">{userName}</p>
                </div>
                 <div>
                  <Label>Date of Birth</Label>
                  <p className="font-medium">{dateOfBirth}</p>
                </div>
              </div>
               <div>
                  <Label>About Me</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {aboutMe}
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
              <p className="text-sm text-muted-foreground">No recent activity to display.</p>
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
                    <Badge variant={false ? "default" : "outline"}>{false ? "Enabled" : "Disabled"}</Badge>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    