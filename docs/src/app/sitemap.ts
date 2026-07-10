import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/docs', '/studio', '/blog', '/examples', '/packages'].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real application, you would fetch your dynamic MDX routes here (blog posts, examples, packages)
  // and append them to the sitemap. For now, we just map the static roots.

  return [...routes];
}
