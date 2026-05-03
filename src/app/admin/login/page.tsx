import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { adminLoginAction } from "@/app/admin/actions";
import { adminPassword } from "@/lib/admin-session";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin/articles");

  const configured = Boolean(adminPassword());
  const sp = await searchParams;
  const err =
    sp.error === "auth"
      ? "密码错误"
      : sp.error === "config"
        ? "服务器未配置 ARTICLE_ADMIN_PASSWORD"
        : null;

  return (
    <div className="mx-auto max-w-md rounded border border-rule bg-white p-8">
      <h1 className="font-display text-2xl font-bold">内容管理登录</h1>
      <p className="mt-2 text-sm text-muted">
        数据库发稿入口。Markdown 仓库稿请在 Git 中编辑{" "}
        <code className="rounded bg-zinc-100 px-1 text-xs">content/articles/*.md</code> 后推送部署。
      </p>
      {err && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">
          {err}
        </p>
      )}
      {!configured && (
        <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          请在环境变量中设置 <strong>ARTICLE_ADMIN_PASSWORD</strong>（Vercel 与本地 .env 同步）。
        </p>
      )}
      <form action={adminLoginAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          后台密码
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-rule px-3 py-2 outline-none ring-ink/20 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          disabled={!configured}
          className="w-full rounded bg-ink py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50"
        >
          登录
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="underline">
          返回首页
        </Link>
      </p>
    </div>
  );
}
