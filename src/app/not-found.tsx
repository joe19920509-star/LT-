import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">404</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">LT</h1>
      <p className="mt-3 font-display text-lg font-medium tracking-wide text-ink/85 md:text-xl">
        Follow Science, Find Money
      </p>
      <p className="mt-2 text-lg text-muted">从实验室到市场</p>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
        您访问的页面不存在或已移动。请从首页或栏目导航继续阅读。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/90"
      >
        返回首页
      </Link>
    </div>
  );
}
