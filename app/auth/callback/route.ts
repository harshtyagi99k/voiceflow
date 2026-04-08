import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies() // ✅ FIX

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
  getAll() {
    return cookieStore.getAll()
  },
  setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
    cookiesToSet.forEach(({ name, value, options }) => {
      cookieStore.set(name, value, options)
    })
  },
}
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const siteUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
      return NextResponse.redirect(`${siteUrl}/dashboard`)
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
  return NextResponse.redirect(`${siteUrl}/login`)
}