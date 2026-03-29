import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const publicPaths = ['/', '/login', '/privacy', '/onboarding'];
  const isPublic = publicPaths.some((p) => path === p)
    || path.startsWith('/api/')
    || path.startsWith('/_next/');

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && path === '/login') {
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
    const url = request.nextUrl.clone();
    url.pathname =
      !profile?.onboarding_completed_at && (boardCount ?? 0) === 0 ? '/onboarding' : '/boards';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
