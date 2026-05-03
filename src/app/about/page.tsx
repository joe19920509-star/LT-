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
          栏目 <strong className="text-ink">Lab to Market</strong> 关注研究与产业落地；{" "}
          <strong className="text-ink">LongTerm & ShortTerm</strong> 对照长短期定价；{" "}
          <strong className="text-ink">Fast & Slow</strong> 观察流动性与风格在快慢之间的切换。
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
