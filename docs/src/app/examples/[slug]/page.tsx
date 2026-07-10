import { getPostBySlug } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { constructMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'examples');
  if (!post) return {};

  return constructMetadata({
    title: `${post.meta.title} Example`,
    description: post.meta.description,
    type: 'article',
  });
}

export default async function ExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'examples');

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <JsonLd
        type="TechArticle"
        data={{
          headline: post.meta.title,
          description: post.meta.description,
          author: { '@type': 'Organization', name: 'PromptForge' },
        }}
      />
      <div className="mb-8 border-b border-white/[0.04] pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">{post.meta.title}</h1>
        <p className="text-[#9CA3AF] text-lg mb-6">{post.meta.description}</p>
        <div className="flex gap-4">
          <Link
            href="/studio"
            className="px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 rounded-md text-sm font-semibold hover:bg-[#22C55E]/20 transition-colors"
          >
            Open in Studio
          </Link>
          <a
            href="https://github.com/Omnikon-Org/PromptForge/tree/main/examples"
            target="_blank"
            className="px-4 py-2 bg-white/[0.02] text-white border border-white/[0.08] rounded-md text-sm font-semibold hover:bg-white/[0.04] transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
      <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#9CA3AF] prose-a:text-[#3B82F6] prose-pre:bg-[#0B0D11] prose-pre:border prose-pre:border-white/[0.04]">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
