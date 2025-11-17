import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get geolocation from request headers (Vercel Edge)
  const country = request.geo?.country || request.headers.get('x-vercel-ip-country');

  // Check if there's already a locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in pathname and we have geolocation data
  if (!pathnameHasLocale && country) {
    // Set locale based on country code
    const locale = country === 'DE' ? 'de' : 'en';

    // Check if user has a saved locale preference
    const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;

    // Use saved locale if available, otherwise use geo-detected locale
    const targetLocale = savedLocale || locale;

    // Redirect to the appropriate locale
    const url = request.nextUrl.clone();
    url.pathname = `/${targetLocale}${pathname}`;
    const response = NextResponse.redirect(url);

    // Save the locale preference in a cookie
    if (!savedLocale) {
      response.cookies.set('NEXT_LOCALE', targetLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
