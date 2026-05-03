import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { adminDeleteArticleAction } from "@/app/admin/actions";

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">全部内容</h1>
      <p className="mt-2 text-sm text-muted">
        <strong>Markdown</strong> 与仓库中 <code className="rounded bg-white px-1">content/articles</code>{" "}
        同步；<strong>数据库</strong> 稿可在本后台增删改。同一 slug 以 Markdown 为准。
      </p>
      <ul className="mt-8 divide-y divide-rule border border-rule bg-white">
        {articles.map((a) => (
          <li key={a.slug} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    a.source === "markdown"
                      ? "rounded bg-zinc-100 px-2 py-0.5 text-xs text-muted"
                      : "rounded bg-ink/5 px-2 py-0.5 text-xs text-muted"
                  }
                >
                  {a.source === "markdown" ? "Markdown" : "数据库"}
                </span>
                <span className="text-xs text-accent">{a.category}</span>
              </div>
              <Link href={`/articles/${a.slug}`} className="mt-1 block font-medium hover:underline" target="_blank">
                {a.title}
              </Link>
              <p className="mt-1 font-mono text-xs text-muted">{a.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {a.source === "database" && (
                <>
                  <Link
                    href={`/admin/articles/${a.slug}/edit`}
                    className="rounded border border-rule px-3 py-1.5 text-sm hover:bg-zinc-50"
                  >
                    编辑
                  </Link>
                  <form action={adminDeleteArticleAction}>
                    <input type="hidden" name="slug" value={a.slug} />
                    <button
                      type="submit"
                      className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-800 hover:bg-red-50"
                    >
                      删除
                    </button>
                  </form>
                </>
              )}
              {a.source === "markdown" && (
                <span className="text-xs text-muted">编辑请改 Git 仓库中 md 文件</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
