import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Инҷо токен ё ролро аз Cookie мегирем (масалан 'role')
    const role = request.cookies.get('role')?.value
    const { pathname } = request.nextUrl

    // Агар корбар ба Dashboard рафтанӣ бошад, вале мактаб бошад -> ба dashboard-school
    if (pathname === '/dashboard' && role === 'school') {
        return NextResponse.redirect(new URL('/dashboard-school', request.url))
    }

    // Агар корбар ба Dashboard-school рафтанӣ бошад, вале маориф бошад -> ба dashboard
    if (pathname === '/dashboard-school' && role === 'ministry') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/dashboard-school/:path*'],
}