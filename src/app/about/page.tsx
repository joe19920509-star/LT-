import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "LT Magazine：把从实验室到市场的路，讲成一个好故事。Follow Science, Find Money.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-black leading-tight text-ink md:text-4xl">
        我们为什么需要一本讲「从实验室到市场」的杂志
      </h1>
      <p className="mt-2 text-sm text-muted">LT Magazine · ltmagazine.cn</p>

      <div className="article-body mt-10 space-y-6 text-muted">
        <p>三年前我从媒体去做投资。不是转行，是去看看钱到底怎么想的。</p>
        <p>
          看了三年，看明白了：科学家和投资人，说的是两种语言。一个讲分子，一个讲回报。中间隔着
          CRO、临床、监管、IPO——一条长长的路，没人专门讲过。
        </p>
        <p>
          也看烦了。BP 里全是数据，没有故事。路演的 PPT 丑得让我想哭。最可怕的是，好项目死在路上，不是因为科学不行，是因为没人知道怎么把它讲成有人愿意听的故事。
        </p>
        <p>所以我回来做媒体。</p>
        <p>
          <strong className="text-ink">LT Magazine</strong> 不做科普，不做财经。我们只做一件事：把从实验室到市场的路，讲成一个好故事。
        </p>
        <p>
          <strong className="text-ink">Fast & Slow</strong>、<strong className="text-ink">Long Term & Short Term</strong>、
          <strong className="text-ink">Lab to Market</strong>
          ——三个栏目，三种节奏。快的时候追热点，慢的时候做深度。短看这周发生了什么，长看十年后什么值钱。
        </p>
        <p>
          我们做这本杂志，是因为相信：科学值得被好好讲述。而钱，只会流向那些被讲好的故事。
        </p>
        <p className="font-display text-lg font-medium tracking-wide text-ink">
          Follow Science, Find Money.
        </p>
        <p className="text-ink">—— Jon</p>
      </div>

      <p className="mt-10 text-sm text-muted">
        发稿与订阅：Markdown 见仓库{" "}
        <code className="rounded bg-zinc-100 px-1 text-ink">content/articles/</code>
        ，或 <Link href="/admin/login" className="font-semibold text-accent underline">内容管理</Link>
        （需配置 <code className="rounded bg-zinc-100 px-1">ARTICLE_ADMIN_PASSWORD</code>）。
      </p>

      <p className="mt-8">
        <Link href="/" className="text-sm font-semibold text-accent underline underline-offset-4">
          返回首页
        </Link>
      </p>
    </div>
  );
}
