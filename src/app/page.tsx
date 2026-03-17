import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, Sparkles, Search, ShoppingBag, FileSpreadsheet } from 'lucide-react';

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isSignedIn = Boolean(user);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="container mx-auto flex items-center justify-between py-5 px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">Swipe</span>
        </Link>
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Link href="/boards">
              <Button size="sm">My boards</Button>
            </Link>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        <section className="flex flex-col items-center text-center px-6 pt-24 pb-20 gap-6 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15]">
            Find affordable versions of
            <br />
            your Pinterest style
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Paste a board, let AI analyze your pins, and swipe through
            similar pieces at prices you&apos;ll actually pay.
          </p>
          <Link href={isSignedIn ? '/boards' : '/login'} className="mt-2">
            <Button size="lg" className="gap-2 px-6">
              {isSignedIn ? 'Go to my boards' : 'Get started'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>

        <section className="border-t bg-muted/30">
          <div className="container mx-auto grid sm:grid-cols-3 gap-px bg-border max-w-3xl">
            {[
              {
                icon: Search,
                title: 'Paste a board link',
                description: 'Import any public Pinterest board or section instantly.',
              },
              {
                icon: Sparkles,
                title: 'AI finds matches',
                description: 'Each pin is analyzed for style, color, and fit to generate smart searches.',
              },
              {
                icon: ShoppingBag,
                title: 'Swipe to keep',
                description: 'Browse results one by one. Swipe right to save, left to skip.',
              },
            ].map((step, i) => (
              <div key={step.title} className="bg-background px-6 py-10 flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {i + 1}
                </div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-2xl text-center space-y-4 px-6">
            <h2 className="text-lg font-medium">
              Why not just use Pinterest&apos;s &ldquo;Shop&rdquo; button?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pinterest&apos;s built-in shopping tends to surface niche boutiques and premium prices.
              Swipe searches across popular retailers like Zara, H&amp;M, ASOS, and more—finding
              similar styles at prices that actually fit a student budget.
            </p>
          </div>
        </section>

        <section className="flex flex-col items-center text-center px-6 py-16 gap-3">
          <FileSpreadsheet className="h-6 w-6 text-primary/70" />
          <h2 className="text-lg font-medium">
            Every saved item goes straight to your Google Sheet
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Connect once in settings, then every right-swipe appends the product details
            to your spreadsheet automatically.
          </p>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Swipe
      </footer>
    </div>
  );
}
