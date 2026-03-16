

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware({
  locales: ['en', 'ru', 'tj'],
  defaultLocale: 'tj',
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('role')?.value;

  // Ислоҳи мантиқи ролҳо: ҷустуҷӯи калимаи dashboard дар дохили URL
  const isMinistryDashboard = /\/dashboard(\/|$)/.test(pathname);
  const isSchoolDashboard = /\/dashboard-school(\/|$)/.test(pathname);

  // Редирект аз рӯи рол
  if (isMinistryDashboard && role === 'school') {
    const newPath = pathname.replace('/dashboard', '/dashboard-school');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  if (isSchoolDashboard && role === 'ministry') {
    const newPath = pathname.replace('/dashboard-school', '/dashboard');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  // Илова кардани .well-known дар ин ҷо ҳатмист
  matcher: ['/((?!api|_next|.well-known|.*\\..*).*)']
};