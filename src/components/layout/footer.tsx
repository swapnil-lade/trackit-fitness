import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 bg-muted/50">
      <div className="container max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your fitness journey, simplified. Track, plan, and achieve your goals with AI-powered insights.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Trackit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
