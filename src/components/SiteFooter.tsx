import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule bg-white py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-ink">LT Magazine</p>
          <p className="mt-2 max-w-sm">
            本站为演示项目：注册并订阅后可阅读全文，并生成个性化「今日看版」。正式运营请接入支付与短信验证。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-medium text-ink">链接</span>
          <Link href="/register" className="hover:underline">
            注册
          </Link>
          <Link href="/subscribe" className="hover:underline">
            订阅说明
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 text-xs opacity-70 md:px-6">
        © {new Date().getFullYear()} ltmagazine.cn · 保留所有权利
      </p>
    </footer>
  );
}
