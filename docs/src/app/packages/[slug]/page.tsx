import { getPostBySlug } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { constructMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'packages');
  if (!post) return {};

  return constructMetadata({
    title: `@promptforgee/${post.slug}`,
    description: post.meta.description,
  });
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'packages');

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <JsonLd
        type="SoftwareApplication"
        data={{
          name: `@promptforgee/${post.slug}`,
          description: post.meta.description,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
        }}
      />
      <div className="mb-8 border-b border-white/[0.04] pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
          @promptforgee/{post.slug}
        </h1>
        <p className="text-[#9CA3AF] text-lg mb-6">{post.meta.description}</p>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0B0D11] border border-white/[0.08] rounded-md font-mono text-sm inline-flex">
          <span className="text-white/40">$</span> npm install @promptforgee/{post.slug}
        </div>
      </div>
      <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#9CA3AF] prose-a:text-[#3B82F6] prose-pre:bg-[#0B0D11] prose-pre:border prose-pre:border-white/[0.04]">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
