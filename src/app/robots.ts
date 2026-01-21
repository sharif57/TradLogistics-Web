import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tradlogistics.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/*',
          '/api/*',
          '/create-manual-order',
          '/create-new-delivery/*',
          '/deliveries/*',
          '/fleet-drivers/*',
          '/inbox',
          '/inventory/*',
          '/orders',
          '/payment',
          '/payments',
          '/settings/*',
          '/support',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/auth/*',
          '/api/*',
          '/create-manual-order',
          '/create-new-delivery/*',
          '/deliveries/*',
          '/fleet-drivers/*',
          '/inbox',
          '/inventory/*',
          '/orders',
          '/payment',
          '/payments',
          '/settings/*',
          '/support',
        ],
        crawlDelay: 10,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
