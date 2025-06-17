
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CheckCircle, TrendingUp, Zap, CalendarDays as VisualDailyScheduleIcon } from 'lucide-react'; // Renamed to avoid conflict if Brain was for AI

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
    icon: <VisualDailyScheduleIcon className="h-8 w-8 text-primary" />, // Using a different icon
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
            <div className="mt-16 relative">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="Trackit Dashboard Preview"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto animate-hero-glow"
                data-ai-hint="fitness dashboard app"
                priority
              />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-xl"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-4">Everything You Need to Succeed</h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-xl mx-auto">
              Trackit offers a suite of powerful tools designed to make fitness tracking and planning effortless and effective.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"> {/* Adjusted for 3 features */}
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

        {/* Pricing Section Placeholder */}
        <section id="pricing" className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
              Choose the plan that's right for you. Get started for free.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: 'Free', price: 0, features: ['Track workouts', 'Log meals', 'Basic scheduling', 'Limited reports'] },
                { name: 'Pro', price: 15, features: ['All Free features', 'Create custom plans', 'Advanced analytics', 'Priority support'] },
                { name: 'Team', price: 25, features: ['All Pro features', 'Team collaboration', 'Shared dashboards', 'User management'] },
              ].map((plan, index) => (
                <Card 
                  key={plan.name} 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col ${index === 1 ? 'border-2 border-primary transform md:scale-105 ring-4 ring-primary/20' : 'hover:border-primary/30'}`}
                >
                  <CardHeader className="pt-8">
                    <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                    <p className="text-4xl font-bold my-2">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  </CardHeader>
                  <CardContent className="text-left flex-grow flex flex-col justify-between">
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((featureText, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> 
                          <span className="text-sm">{featureText}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-auto" variant={index === 1 ? 'default' : 'outline'}>
                      {index === 0 ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24">
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
