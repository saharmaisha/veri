import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isFirstTrackedEvent, trackAppEvent } from '@/lib/services/app-events';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let redirectPath = next ?? '/boards';
      if (user) {
        const [{ data: profile }, { count: boardCount }] = await Promise.all([
          supabase
            .from('profiles')
            .select('onboarding_completed_at')
            .eq('id', user.id)
            .single(),
          supabase
            .from('pinterest_boards')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
        ]);

        await trackAppEvent({
          userId: user.id,
          eventType: 'auth_login_completed',
          path: '/api/auth/callback',
          metadata: { next: next ?? null },
        });

        if (await isFirstTrackedEvent(user.id, 'signup_completed')) {
          await trackAppEvent({
            userId: user.id,
            eventType: 'signup_completed',
            path: '/api/auth/callback',
            metadata: { email: user.email ?? null },
          });
        }

        if (!profile?.onboarding_completed_at && (boardCount ?? 0) === 0) {
          redirectPath = '/onboarding';
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
