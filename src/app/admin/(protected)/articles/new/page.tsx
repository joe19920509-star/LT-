import { AdminArticleForm } from "../AdminArticleForm";

export default function AdminNewArticlePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">新建文章（写入数据库）</h1>
      <p className="mt-2 text-sm text-muted">
        若与 Markdown 文件 slug 冲突，线上以 Markdown 为准。长期 Git 发稿请使用{" "}
        <code className="rounded bg-white px-1">content/articles/*.md</code>。
      </p>
      <div className="mt-8 rounded border border-rule bg-white p-6">
        <AdminArticleForm mode="create" />
      </div>
    </div>
  );
}
