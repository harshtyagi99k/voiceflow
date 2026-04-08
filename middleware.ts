import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // NEVER block these paths — auth needs them to work
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
  getAll() {
    return request.cookies.getAll()
  },
  setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
    cookiesToSet.forEach(({ name, value }) =>
      request.cookies.set(name, value)
    )

    response = NextResponse.next({ request })

    cookiesToSet.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options)
    )
  },
},
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedPaths = ['/dashboard', '/generate', '/admin']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  // Not logged in + trying to access protected page → send to login
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Already logged in + on login/signup page → send to dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
