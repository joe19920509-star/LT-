import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { pickHomeLeadAndRest } from "@/lib/home-banner";
import { getMarketStrip } from "@/lib/market-quotes";
import { SECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await getAllArticles();
  const topArticles = articles.slice(0, 8);
  const strip = await getMarketStrip();

  const { lead, rest } = pickHomeLeadAndRest(topArticles);

  const sectionCards = SECTIONS.map((s) => {
    const inSection = articles.filter((a) => a.category === s.label);
    return {
      ...s,
      preview: inSection[0] ?? null,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-8">
      <section id="markets" className="mb-10 overflow-hidden border border-strip bg-strip text-paper shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2 md:px-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Market snapshot
          </span>
          <span className="text-[10px] text-white/40">行情仅供参考</span>
        </div>
        <div className="grid md:grid-cols-4">
          {strip.map((x, i) => (
            <div
              key={x.label}
              className={`border-white/10 px-4 py-4 md:border-r md:py-5 md:last:border-r-0 ${
                i > 0 ? "border-t md:border-t-0" : ""
              }`}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">{x.label}</p>
              <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums tracking-tight text-white md:text-[1.65rem]">
                {x.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="sections" className="mb-12 scroll-mt-28">
        <div className="mb-4 flex items-end justify-between border-b border-rule pb-2">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink md:text-xl">栏目</h2>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted">Sections</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectionCards.map((s) => (
            <Link
              key={s.slug}
              href={`/section/${s.slug}`}
              className="group flex min-h-[220px] flex-col border border-rule bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition hover:border-rule hover:shadow-md"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Column</span>
              <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-ink group-hover:underline md:text-[1.35rem]">
                {s.label}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.blurb}</p>
              {s.preview ? (
                <p className="mt-4 border-t border-rule pt-3 text-xs leading-snug text-ink">
                  <span className="font-medium text-muted">最新 · </span>
                  <span className="line-clamp-2">{s.preview.title}</span>
                </p>
              ) : (
                <p className="mt-4 border-t border-rule pt-3 text-xs text-muted">该栏目下暂无文章</p>
              )}
              <span className="mt-4 text-xs font-semibold text-accent">
                进入栏目
                <span className="ml-1 transition group-hover:translate-x-0.5 inline-block">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {lead && (
        <section className="mb-12 border-b border-rule pb-12">
          <div className="border-l-[3px] border-accent pl-5 md:pl-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              {lead.category}
            </p>
            <Link href={`/articles/${lead.slug}`}>
              <h1 className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-ink hover:underline md:text-5xl md:leading-[1.08]">
                {lead.title}
              </h1>
            </Link>
            <p className="mt-4 max-w-3xl font-display text-lg font-normal leading-snug text-muted md:text-xl">
              {lead.dek}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/90">{lead.excerpt}</p>
            <Link
              href={`/articles/${lead.slug}`}
              className="mt-6 inline-block text-sm font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              继续阅读
            </Link>
          </div>
        </section>
      )}

      <section id="latest" className="scroll-mt-28">
        <div className="mb-5 flex items-end justify-between border-b border-rule pb-2">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink md:text-xl">最新报道</h2>
          <span className="text-[11px] text-muted">订阅会员可读全文</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((a) => (
            <article
              key={a.slug}
              className="flex flex-col border border-rule bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition hover:shadow-md"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">{a.category}</p>
              <Link href={`/articles/${a.slug}`}>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-ink hover:underline md:text-2xl">
                  {a.title}
                </h3>
              </Link>
              <p className="mt-2 text-sm text-muted">{a.dek}</p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/85">{a.excerpt}</p>
              <Link
                href={`/articles/${a.slug}`}
                className="mt-4 text-xs font-semibold text-accent hover:underline"
              >
                阅读全文
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
