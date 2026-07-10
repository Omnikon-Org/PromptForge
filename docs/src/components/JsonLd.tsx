'use client';

export type SchemaType =
  'SoftwareApplication' | 'Article' | 'BreadcrumbList' | 'WebSite' | 'Organization' | 'TechArticle';

export function JsonLd({ type, data }: { type: SchemaType; data: Record<string, unknown> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  // We use dangerouslySetInnerHTML to safely inject the JSON-LD script
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
