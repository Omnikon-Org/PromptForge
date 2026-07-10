import { getPostBySlug } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { constructMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'blog');
  if (!post) return {};

  return constructMetadata({
    title: post.meta.title,
    description: post.meta.description,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'blog');

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 lg:px-8">
      <JsonLd
        type="TechArticle"
        data={{
          headline: post.meta.title,
          description: post.meta.description,
          datePublished: post.meta.date,
          author: { '@type': 'Organization', name: 'PromptForge' },
        }}
      />
      <h1 className="text-4xl font-bold tracking-tight text-white mb-4">{post.meta.title}</h1>
      <div className="text-[#9CA3AF] text-sm mb-12 flex items-center gap-4">
        <span>{new Date(post.meta.date).toLocaleDateString()}</span>
      </div>
      <article className="prose prose-invert prose-blue max-w-none prose-headings:text-white prose-p:text-[#9CA3AF] prose-a:text-[#3B82F6]">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
