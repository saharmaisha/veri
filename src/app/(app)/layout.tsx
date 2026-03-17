import { createClient } from '@/lib/supabase/server';
import { AppNav } from '@/components/layout/AppNav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <AppNav email={user?.email} />
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
