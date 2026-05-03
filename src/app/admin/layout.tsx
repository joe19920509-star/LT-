import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="border-b border-rule bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm text-muted hover:text-ink">
            ← 站点首页
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">CMS</span>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
