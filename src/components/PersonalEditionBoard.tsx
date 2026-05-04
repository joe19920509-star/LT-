import type { ReactNode } from "react";
import Link from "next/link";
import type { EditionBoardData, EditionItem } from "@/lib/edition-types";

type Props = {
  edition: EditionBoardData;
  /** 例如订阅提示条；无则不渲染 */
  notice?: ReactNode;
};

function ItemBlock({ item }: { item: EditionItem }) {
  const kicker = (
    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
      {item.kind === "internal" ? item.category : item.category}
    </p>
  );

  if (item.kind === "internal") {
    return (
      <article>
        {kicker}
        <Link href={`/articles/${item.slug}`} className="group">
          <h3 className="mt-1 font-display text-xl font-bold leading-snug text-ink group-hover:underline md:text-[1.35rem]">
            {item.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{item.dek}</p>
      </article>
    );
  }

  return (
    <article className="cursor-default">
      {kicker}
      <h3 className="mt-1 font-display text-xl font-bold leading-snug text-ink md:text-[1.35rem]">{item.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{item.dek}</p>
    </article>
  );
}

function itemKey(item: EditionItem, index: number): string {
  if (item.kind === "internal") return item.slug;
  return item.id || `ext-${index}`;
}

export function PersonalEditionBoard({ edition, notice }: Props) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-2">
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
        {edition.ordered.map((item, i) => (
          <li key={itemKey(item, i)} className="marker:font-display marker:text-accent">
            <ItemBlock item={item} />
          </li>
        ))}
      </ol>
    </section>
  );
}
