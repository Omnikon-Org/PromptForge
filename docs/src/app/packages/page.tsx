import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';
import { constructMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { ArrowRight, Package } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Packages',
  description: 'The PromptForge ecosystem of packages for Prompt Engineering.',
});

export default function PackagesIndex() {
  const posts = getAllPosts('packages');

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <JsonLd
        type="WebSite"
        data={{
          name: 'PromptForge Packages',
          description: metadata.description,
        }}
      />

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Packages</h1>
        <p className="text-lg text-[#9CA3AF]">
          Modular tools for every part of your prompt engineering workflow.
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post?.slug}
            href={`/packages/${post?.slug}`}
            className="group block p-6 border border-white/[0.04] bg-[#080A0F] rounded-lg hover:border-[#F59E0B]/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-[#F59E0B]" />
              <h2 className="text-xl font-bold text-white group-hover:text-[#F59E0B] transition-colors">
                @promptforgee/{post?.slug}
              </h2>
            </div>
            <p className="text-[#9CA3AF] mb-4">{post?.meta.description}</p>
            <div className="flex items-center text-[#F59E0B] text-sm font-semibold">
              View Documentation{' '}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
