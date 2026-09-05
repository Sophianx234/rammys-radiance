import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://rammysradiance.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/', '/checkout/', '/settings/', '/cart/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
