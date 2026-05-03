import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { pickHomeLeadAndRest } from "@/lib/home-banner";
import { getMarketStrip } from "@/lib/market-quotes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = (await getAllArticles()).slice(0, 8);
  const strip = await getMarketStrip();

  const { lead, rest } = pickHomeLeadAndRest(articles);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <section
        id="markets"
        className="mb-10 grid gap-3 border border-rule bg-white p-4 text-sm md:grid-cols-4"
      >
        {strip.map((x) => (
          <div key={x.label} className="border-rule md:border-r md:last:border-0 md:pr-4">
            <p className="text-xs font-medium tracking-wide text-muted">{x.label}</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">{x.value}</p>
          </div>
        ))}
      </section>

      {lead && (
        <section className="mb-12 border-b border-rule pb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
            {lead.category}
          </p>
          <Link href={`/articles/${lead.slug}`}>
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight hover:underline md:text-5xl">
              {lead.title}
            </h1>
          </Link>
          <p className="mt-4 max-w-3xl font-display text-xl text-muted">{lead.dek}</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed">{lead.excerpt}</p>
          <Link
            href={`/articles/${lead.slug}`}
            className="mt-6 inline-block text-sm font-semibold text-ink underline decoration-accent underline-offset-4"
          >
            继续阅读
          </Link>
        </section>
      )}

      <section id="latest">
        <div className="mb-6 flex items-end justify-between border-b-2 border-ink pb-2">
          <h2 className="font-display text-2xl font-bold">最新报道</h2>
          <span className="text-xs text-muted">订阅会员可读全文</span>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {rest.map((a) => (
            <article key={a.slug} className="border-b border-rule pb-8 md:border-0 md:pb-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{a.category}</p>
              <Link href={`/articles/${a.slug}`}>
                <h3 className="mt-2 font-display text-2xl font-bold leading-snug hover:underline">
                  {a.title}
                </h3>
              </Link>
              <p className="mt-2 text-muted">{a.dek}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{a.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
