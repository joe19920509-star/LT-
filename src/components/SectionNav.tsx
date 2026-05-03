import Link from "next/link";
import { SECTIONS } from "@/lib/sections";

export function SectionNav() {
  return (
    <nav
      className="border-t border-rule bg-paper/90"
      aria-label="栏目"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 text-sm md:gap-x-6 md:px-6">
        <Link href="/" className="shrink-0 font-medium text-ink hover:text-accent">
          首页
        </Link>
        {SECTIONS.map((s) => (
          <Link
            key={s.slug}
            href={`/section/${s.slug}`}
            className="shrink-0 text-muted hover:text-ink"
          >
            {s.label}
          </Link>
        ))}
        <Link href="/about" className="shrink-0 font-medium text-ink hover:text-accent">
          About
        </Link>
      </div>
    </nav>
  );
}
