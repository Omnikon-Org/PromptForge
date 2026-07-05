'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname() || '/';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Docs', href: '/docs' },
    { name: 'Playground', href: '/playground' },
  ];

  return (
    <nav className="hidden md:flex items-center gap-8 text-sm font-mono text-[#9CA3AF]">
      {navLinks.map((link) => {
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`transition-colors ${
              isActive
                ? 'font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                : 'hover:text-white'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
      <Link
        href="https://github.com/promptforge/promptforge"
        target="_blank"
        className="hover:text-white transition-colors"
      >
        GitHub
      </Link>
    </nav>
  );
}
