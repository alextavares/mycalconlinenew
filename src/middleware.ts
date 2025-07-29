import createMiddleware from 'next-intl/middleware'
import { defaultLocale, locales } from '@/config/i18n.config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always include locale in URL
  localeDetection: true, // Enable automatic locale detection
})

export const config = {
  // Match all paths except for
  // - API routes
  // - Next.js internals
  // - Static assets (e.g., images, fonts)
  // - Files with extensions (e.g., favicon.ico, sitemap.xml)
  matcher: ['/((?!api|_next/static|_next/image|.*\..*).*)'],
}
