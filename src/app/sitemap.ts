import { MetadataRoute } from 'next';
import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rammysradiance.com';

  const routes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/shop',
    '/blog',
    '/contact',
    '/corporate',
    '/delivery',
    '/faqs',
    '/privacy',
    '/returns',
    '/support',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    await connectToDatabase();
    const products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();
    
    const productRoutes = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.slug || product._id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return routes;
  }
}
