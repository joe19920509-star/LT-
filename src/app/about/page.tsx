import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "LT Magazine — ltmagazine.cn 关于我们",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-black">About</h1>
      <p className="mt-2 text-sm text-muted">LT Magazine · ltmagazine.cn</p>

      <div className="article-body mt-10 space-y-6 text-muted">
        <p>
          LT Magazine 是一份以<strong className="text-ink">订阅阅读</strong>
          为主的财经与观点内容产品，聚焦市场结构、跨资产线索与长期叙事。注册并订阅后可阅读全文，并基于您的画像生成「今日看版」。
        </p>
        <p>
          <strong className="text-ink">Lab to Market</strong>
          ：从实验室到华尔街，一件事是怎么变成一门生意的。{" "}
          <strong className="text-ink">LongTerm & ShortTerm</strong>
          ：用长期结构看短期机会，用短期心跳测长期方向。{" "}
          <strong className="text-ink">Fast & Slow</strong>
          ：热点发生的时候，我们先冲进去，再退出来想清楚。
        </p>
        <p>
          发稿方式：<strong className="text-ink">Git Markdown</strong>（仓库{" "}
          <code className="rounded bg-zinc-100 px-1 text-ink">content/articles/*.md</code>
          ）或登录 <Link href="/admin/login" className="font-semibold text-accent underline">内容管理</Link>{" "}
          写入数据库（需配置环境变量 <code className="rounded bg-zinc-100 px-1">ARTICLE_ADMIN_PASSWORD</code>）。
        </p>
        <p>商务与合作联系邮箱请后续在后台配置；当前为演示部署。</p>
      </div>

      <p className="mt-10">
        <Link href="/" className="text-sm font-semibold text-accent underline underline-offset-4">
          返回首页
        </Link>
      </p>
    </div>
  );
}
