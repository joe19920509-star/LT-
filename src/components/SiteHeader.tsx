import Link from "next/link";
import { getCurrentUser, isSubscriptionActive } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const subscribed = user ? isSubscriptionActive(user) : false;

  return (
    <header className="border-b border-rule bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-xl font-bold tracking-tight md:text-2xl">
            LT Magazine
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted md:flex">
            <Link href="/" className="hover:text-ink">
              首页
            </Link>
            <Link href="/#markets" className="hover:text-ink">
              市场
            </Link>
            <Link href="/#latest" className="hover:text-ink">
              最新
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              {subscribed ? (
                <span className="hidden rounded-full bg-ink/5 px-2 py-0.5 text-xs text-muted sm:inline">
                  订阅会员
                </span>
              ) : (
                <Link
                  href="/subscribe"
                  className="rounded border border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-paper"
                >
                  开通订阅
                </Link>
              )}
              <Link href="/account" className="text-muted hover:text-ink">
                账户
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-muted hover:text-ink"
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-ink">
                登录
              </Link>
              <Link
                href="/register"
                className="rounded bg-ink px-3 py-1.5 text-xs font-medium text-paper hover:bg-ink/90"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs md:px-6">
          <span className="opacity-90">ltmagazine.cn · 订阅制财经阅读</span>
          <span className="opacity-75">
            {new Date().toLocaleDateString("zh-CN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
