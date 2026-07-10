import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';
import { constructMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { ArrowRight } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Blog',
  description: 'Technical articles on Prompt Engineering, LLMs, and TypeScript.',
});

export default function BlogIndex() {
  const posts = getAllPosts('blog');

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <JsonLd
        type="WebSite"
        data={{
          name: 'PromptForge Blog',
          description: metadata.description,
        }}
      />

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Engineering Blog</h1>
        <p className="text-lg text-[#9CA3AF]">
          Technical deep dives into building production AI systems with TypeScript.
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post?.slug}
            href={`/blog/${post?.slug}`}
            className="group block p-6 border border-white/[0.04] bg-[#080A0F] rounded-lg hover:border-[#3B82F6]/50 transition-colors"
          >
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors">
              {post?.meta.title}
            </h2>
            <p className="text-[#9CA3AF] mb-4">{post?.meta.description}</p>
            <div className="flex items-center text-[#3B82F6] text-sm font-semibold">
              Read Article{' '}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
