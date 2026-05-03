import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "登录",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next =
    sp.next && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/account";

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-bold">登录</h1>
      <p className="mt-2 text-sm text-muted">使用注册邮箱与密码登录。</p>
      <LoginForm nextPath={next} />
    </div>
  );
}
