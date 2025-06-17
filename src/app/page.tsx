
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CheckCircle, TrendingUp, Zap, CalendarDays as VisualDailyScheduleIcon } from 'lucide-react';

const features = [
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: 'Comprehensive Tracking',
    description: 'Monitor workouts, meals, and daily activities all in one place.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Personalized Plans',
    description: 'Create custom workout and diet plans tailored to your specific goals.',
  },
  {
    icon: <VisualDailyScheduleIcon className="h-8 w-8 text-primary" />,
    title: 'Visual Daily Schedule',
    description: 'Organize your day with a clear, visual planner for all your tasks.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold mb-6 tracking-tight">
              Unlock Your <span className="text-primary">Fitness Potential</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Trackit helps you seamlessly manage your workouts, diet, and schedule. Reach your goals faster.
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
              <Link href="/register">Get Started For Free</Link>
            </Button>
            {/* Removed hero image placeholder div and Image component */}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-4">Everything You Need to Succeed</h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-xl mx-auto">
              Trackit offers a suite of powerful tools designed to make fitness tracking and planning effortless and effective.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col text-center group">
                  <CardHeader className="items-center pt-8">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">Ready to Transform Your Fitness?</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join Trackit today and take the first step towards a healthier, stronger you.
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
              <Link href="/register">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
