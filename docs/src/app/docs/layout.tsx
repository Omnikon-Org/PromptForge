import Link from 'next/link';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 flex flex-col md:flex-row gap-12">
      <aside className="w-full md:w-64 shrink-0">
        <nav className="flex flex-col space-y-1 sticky top-24">
          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
            Getting Started
          </h4>
          <Link
            href="/docs"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-foreground"
          >
            Introduction
          </Link>
          <Link
            href="/docs#installation"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            Installation
          </Link>
          <Link
            href="/docs#api-reference"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            API Reference
          </Link>
          <h4 className="font-semibold mt-6 mb-2 text-sm uppercase tracking-wider text-muted-foreground">
            Packages
          </h4>
          <Link
            href="/docs#core"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            @promptforgee/core
          </Link>
          <Link
            href="/docs#analyzer"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            @promptforgee/analyzer
          </Link>
          <Link
            href="/docs#optimizer"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            @promptforgee/optimizer
          </Link>
          <Link
            href="/docs#registry"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            @promptforgee/registry
          </Link>
          <Link
            href="/docs#cli"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            @promptforgee/cli
          </Link>
          <Link
            href="/docs#templates"
            className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            @promptforgee/templates
          </Link>
        </nav>
      </aside>
      <main className="flex-1 min-w-0 prose prose-invert prose-cyan max-w-none">{children}</main>
    </div>
  );
}
