import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { adminLogoutAction } from "@/app/admin/actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
        <nav className="flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/admin/articles" className="hover:text-accent">
            全部内容
          </Link>
          <Link href="/admin/articles/new" className="hover:text-accent">
            新建（数据库）
          </Link>
          <Link href="/admin/dashboard" className="hover:text-accent">
            数据看板
          </Link>
        </nav>
        <form action={adminLogoutAction}>
          <button type="submit" className="text-sm text-muted hover:text-ink">
            退出后台
          </button>
        </form>
      </div>
      {children}
    </>
  );
}
