import Link from "next/link";
import { SECTIONS } from "@/lib/sections";

export function SectionNav() {
  return (
    <nav className="border-t border-b border-rule bg-white" aria-label="栏目">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2.5 px-4 py-2.5 text-[15px] md:gap-x-8 md:px-6 md:py-3 md:text-base">
        <Link href="/" className="shrink-0 font-semibold text-ink hover:text-accent">
          首页
        </Link>
        {SECTIONS.map((s) => (
          <Link
            key={s.slug}
            href={`/section/${s.slug}`}
            className="shrink-0 font-medium text-muted hover:text-accent"
          >
            {s.label}
          </Link>
        ))}
        <Link href="/about" className="shrink-0 font-semibold text-ink hover:text-accent">
          About
        </Link>
      </div>
    </nav>
  );
}
