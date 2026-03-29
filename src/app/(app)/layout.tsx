import { createClient } from '@/lib/supabase/server';
import { AppNav } from '@/components/layout/AppNav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email ?? undefined;
  } catch {
    // Auth may fail during initial navigation; render layout without email
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav email={email} />
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
