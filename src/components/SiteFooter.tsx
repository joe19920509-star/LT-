import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule bg-white py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div>
          <p className="font-display text-xl font-bold text-ink md:text-2xl">LT Magazine</p>
          <p className="mt-2 font-display text-sm font-medium tracking-wide text-ink/80 md:text-base">
            Follow Science, Find Money
          </p>
          <p className="mt-1 text-base text-muted">从实验室到市场</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-medium text-ink">链接</span>
          <Link href="/register" className="hover:underline">
            注册
          </Link>
          <Link href="/subscribe" className="hover:underline">
            订阅说明
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/admin/login" className="hover:underline">
            内容管理
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 text-xs opacity-70 md:px-6">
        © {new Date().getFullYear()} ltmagazine.cn · 保留所有权利
      </p>
    </footer>
  );
}
