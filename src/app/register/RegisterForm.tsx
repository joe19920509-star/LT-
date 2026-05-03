"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerAction, type RegisterState } from "@/app/actions/auth";

const initial: RegisterState = {};

const REGIONS = [
  "北京",
  "上海",
  "广东",
  "浙江",
  "江苏",
  "四川",
  "湖北",
  "福建",
  "山东",
  "河南",
  "湖南",
  "重庆",
  "天津",
  "陕西",
  "辽宁",
  "香港",
  "台湾",
  "澳门",
  "其他境内",
  "海外",
];

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, initial);

  useEffect(() => {
    if (state.ok) router.push("/subscribe");
  }, [state.ok, router]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      )}

      <label className="block text-sm font-medium">
        邮箱
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 text-ink outline-none ring-ink/20 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium">
        密码（至少 8 位）
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 outline-none ring-ink/20 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium">
        手机号（中国大陆）
        <input
          name="phone"
          type="tel"
          required
          placeholder="1xxxxxxxxxx"
          pattern="^1[3-9][0-9]{9}$"
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 outline-none ring-ink/20 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium">
        年龄
        <input
          name="age"
          type="number"
          required
          min={16}
          max={120}
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 outline-none ring-ink/20 focus:ring-2"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium">性别</legend>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {[
            { v: "male", l: "男" },
            { v: "female", l: "女" },
            { v: "other", l: "其他" },
            { v: "prefer_not", l: "不愿透露" },
          ].map((o) => (
            <label key={o.v} className="inline-flex items-center gap-2">
              <input type="radio" name="gender" value={o.v} required className="accent-ink" />
              {o.l}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-medium">
        地区
        <select
          name="region"
          required
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 outline-none ring-ink/20 focus:ring-2"
        >
          <option value="">请选择</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        职业 / 工作
        <input
          name="occupation"
          type="text"
          required
          placeholder="例如：金融分析师、软件工程师"
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 outline-none ring-ink/20 focus:ring-2"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-ink py-3 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "提交中…" : "注册并继续"}
      </button>
    </form>
  );
}
