import Link from "next/link";
import { getCurrentUser, isSubscriptionActive } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { SectionNav } from "@/components/SectionNav";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const subscribed = user ? isSubscriptionActive(user) : false;

  return (
    <header className="border-b border-rule bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-ink md:text-2xl md:tracking-tighter"
          >
            LT Magazine
          </Link>
          <nav className="hidden items-center gap-5 text-[13px] font-medium tracking-wide text-muted lg:flex">
            <Link href="/#markets" className="hover:text-accent">
              市场速览
            </Link>
            <Link href="/#sections" className="hover:text-accent">
              栏目
            </Link>
            <Link href="/#latest" className="hover:text-accent">
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
                  className="rounded border border-accent px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/5"
                >
                  开通订阅
                </Link>
              )}
              <Link href="/account" className="text-muted hover:text-accent">
                账户
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-muted hover:text-accent"
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-accent">
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
      <SectionNav />
      <div className="border-t border-rule bg-strip text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] font-medium tracking-wide md:px-6">
          <span className="text-white/85">ltmagazine.cn · 订阅制财经阅读</span>
          <span className="text-white/65">
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
