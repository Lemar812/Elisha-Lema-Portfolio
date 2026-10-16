import { ThemeProvider } from "@/studio/components/providers/ThemeProvider";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
export function ReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <main className="project-page">
        <header className="project-page-header">
          <Link href="/">
            <BrandLogo white className="w-48" />
          </Link>
          <nav className="flex flex-wrap gap-5 text-sm">
            <Link href="/work">Work</Link>
            <Link href="/about">About</Link>
            <Link href="/writing">Notes</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/">Open desktop ↗</Link>
          </nav>
        </header>
        <div className="ec-content">{children}</div>
      </main>
    </ThemeProvider>
  );
}
