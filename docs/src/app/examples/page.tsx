import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';
import { constructMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { ArrowRight, Terminal } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Examples',
  description: 'Production-ready prompt examples built with PromptForge.',
});

export default function ExamplesIndex() {
  const posts = getAllPosts('examples');

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 lg:px-8">
      <JsonLd
        type="WebSite"
        data={{
          name: 'PromptForge Examples',
          description: metadata.description,
        }}
      />

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Examples Library</h1>
        <p className="text-lg text-[#9CA3AF]">
          Discover how to build type-safe prompts for SQL generation, Security Audits, RAG, and
          more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post?.slug}
            href={`/examples/${post?.slug}`}
            className="group block p-6 border border-white/[0.04] bg-[#080A0F] rounded-lg hover:border-[#22C55E]/50 transition-colors"
          >
            <Terminal className="w-8 h-8 text-[#22C55E] mb-4 opacity-80" />
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#22C55E] transition-colors">
              {post?.meta.title}
            </h2>
            <p className="text-[#9CA3AF] mb-4 text-sm">{post?.meta.description}</p>
            <div className="flex items-center text-[#22C55E] text-sm font-semibold">
              View Source{' '}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
