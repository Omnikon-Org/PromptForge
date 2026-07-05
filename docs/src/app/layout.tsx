import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { TopNav } from '../components/TopNav';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PromptForge | Engineer Better AI Prompts',
  description: 'Prompt engineering for production. Type-safe, composable, and extensible.',
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon_io/favicon.ico',
    apple: '/favicon_io/apple-touch-icon.png',
  },
  manifest: '/favicon_io/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-pt-24 scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#050608] text-white selection:bg-[#22C55E]/30`}
      >
        <header className="sticky top-0 w-full h-16 flex items-center justify-between px-6 md:px-12 border-b border-white/[0.04] bg-[#050608]/90 backdrop-blur-md z-50">
          <div className="flex items-center gap-3">
            {/* PF Logo Lockup */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/PromptForgeLogo.png"
                alt="PromptForge Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                priority
              />
              <div className="flex flex-col justify-center mt-0.5 hidden sm:flex">
                <div className="text-lg md:text-xl font-bold tracking-[0.2em] flex items-center leading-none mb-1">
                  <span className="text-white group-hover:text-white/90 transition-colors">
                    PROMPT
                  </span>
                  <span className="text-[#22C55E] group-hover:text-[#1eb355] transition-colors">
                    FORGE
                  </span>
                </div>
                <span className="text-[8px] md:text-[9px] text-[#9CA3AF] tracking-[0.3em] leading-none uppercase">
                  Engineer Better AI Prompts
                </span>
              </div>
            </Link>
          </div>

          <TopNav />

          <div className="flex items-center">
            <Link
              href="/docs"
              className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-white/[0.12] text-sm font-mono text-white/90 hover:border-[#22C55E]/40 hover:text-[#22C55E] transition-all bg-white/[0.02] hover:bg-[#22C55E]/10"
            >
              <span className="text-[#22C55E]">&gt;_</span> Get Started
            </Link>
          </div>
        </header>
        <main className="flex-1 relative">{children}</main>
      </body>
    </html>
  );
}
