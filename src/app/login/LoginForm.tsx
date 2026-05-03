"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { loginAction, type RegisterState } from "@/app/actions/auth";

const initial: RegisterState = {};

export function LoginForm({ nextPath = "/account" }: { nextPath?: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initial);

  useEffect(() => {
    if (state.ok) router.push(nextPath);
  }, [state.ok, router, nextPath]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      )}
      <label className="block text-sm font-medium">
        邮箱
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 outline-none ring-ink/20 focus:ring-2"
        />
      </label>
      <label className="block text-sm font-medium">
        密码
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 outline-none ring-ink/20 focus:ring-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-ink py-3 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "登录中…" : "登录"}
      </button>
      <p className="text-center text-sm text-muted">
        没有账号？{" "}
        <Link href="/register" className="font-semibold text-ink underline">
          注册
        </Link>
      </p>
    </form>
  );
}
