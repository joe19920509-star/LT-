import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { loadMarkdownArticlesSync } from "@/lib/articles";
import { AdminArticleForm } from "../../AdminArticleForm";

function toDatetimeLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Props = { params: Promise<{ slug: string }> };

export default async function AdminEditArticlePage({ params }: Props) {
  const { slug } = await params;
  if (loadMarkdownArticlesSync().some((a) => a.slug === slug)) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <p className="font-medium">该 slug 由 Markdown 提供</p>
        <p className="mt-2">
          请在仓库中编辑{" "}
          <code className="rounded bg-white px-1">content/articles/{slug}.md</code> 后推送部署。
        </p>
        <Link href="/admin/articles" className="mt-4 inline-block text-sm font-semibold underline">
          返回列表
        </Link>
      </div>
    );
  }

  const row = await prisma.article.findUnique({ where: { slug } });
  if (!row) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">编辑文章</h1>
      <div className="mt-8 rounded border border-rule bg-white p-6">
        <AdminArticleForm
          mode="edit"
          defaultValues={{
            slug: row.slug,
            title: row.title,
            category: row.category,
            dek: row.dek,
            excerpt: row.excerpt,
            body: row.body,
            publishedAt: toDatetimeLocalValue(row.publishedAt),
          }}
        />
      </div>
    </div>
  );
}
