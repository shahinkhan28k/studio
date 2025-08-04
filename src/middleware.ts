
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware is not currently required as auth is handled client-side.
// This file can be used in the future to implement server-side route protection.

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
