import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/articles";
import { getSectionBySlug } from "@/lib/sections";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) return { title: "未找到栏目" };
  return {
    title: section.label,
    description: section.blurb,
  };
}

export default async function SectionPage({ params }: Props) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) notFound();

  const articles = (await getAllArticles()).filter((a) => a.category === section.label);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">栏目</p>
      <h1 className="mt-2 font-display text-4xl font-black tracking-tight md:text-5xl">{section.label}</h1>
      <p className="mt-4 max-w-2xl text-muted">{section.blurb}</p>

      <div className="mt-12 border-t-2 border-ink pt-8">
        {articles.length === 0 ? (
          <p className="text-muted">
            该栏目下暂无文章。请在 <code className="rounded bg-paper px-1">content/articles/*.md</code> 的 frontmatter
            里将 <code className="rounded bg-paper px-1">category</code> 设为「{section.label}」，或使用后台新建数据库稿。
          </p>
        ) : (
          <ul className="grid gap-10 md:grid-cols-2">
            {articles.map((a) => (
              <li key={a.slug}>
                <article>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{a.category}</p>
                  <Link href={`/articles/${a.slug}`}>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-snug hover:underline">{a.title}</h2>
                  </Link>
                  <p className="mt-2 text-muted">{a.dek}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{a.excerpt}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-12">
        <Link href="/" className="text-sm font-semibold text-muted hover:text-ink">
          ← 返回首页
        </Link>
      </p>
    </div>
  );
}
