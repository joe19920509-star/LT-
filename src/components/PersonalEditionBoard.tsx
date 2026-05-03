import type { ReactNode } from "react";
import Link from "next/link";

export type EditionBoardData = {
  headline: string;
  subline: string;
  ordered: { slug: string; category: string; title: string; dek: string }[];
  tags: string[];
};

type Props = {
  edition: EditionBoardData;
  /** 例如订阅提示条；无则不渲染 */
  notice?: ReactNode;
};

export function PersonalEditionBoard({ edition, notice }: Props) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-2">
        <div>
          <h2 className="font-display text-2xl font-bold">{edition.headline}</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted">{edition.subline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {edition.tags.map((t) => (
            <span key={t} className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>

      {notice}

      <ol className="grid list-decimal gap-6 pl-5 md:grid-cols-2">
        {edition.ordered.map((a) => (
          <li key={a.slug} className="marker:font-display marker:text-accent">
            <article>
              <p className="text-xs font-semibold uppercase text-muted">{a.category}</p>
              <Link href={`/articles/${a.slug}`} className="group">
                <h3 className="mt-1 font-display text-xl font-bold leading-snug group-hover:underline">{a.title}</h3>
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{a.dek}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
