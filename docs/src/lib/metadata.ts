import { Metadata } from 'next';
import { siteConfig } from './site.config';

type MetadataProps = {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
};

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon_io/favicon.ico',
  noIndex = false,
  type = 'website',
}: MetadataProps = {}): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: 'PromptForge' }],
    creator: 'PromptForge',
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      images: [image],
      creator: '@promptforge',
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
