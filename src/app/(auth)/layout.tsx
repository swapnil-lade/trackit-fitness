import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <div className="mb-8">
        <Link href="/" aria-label="Back to homepage">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <main className="w-full max-w-md">
        {children}
      </main>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Trackit. All rights reserved.</p>
      </footer>
    </div>
  );
}
