"use client";

import { useActionState } from "react";
import {
  adminCreateArticleAction,
  adminUpdateArticleAction,
  type AdminArticleFormState,
} from "@/app/admin/actions";
import { ARTICLE_CATEGORIES } from "@/lib/article-categories";

const initial: AdminArticleFormState = {};

type Props = {
  mode: "create" | "edit";
  defaultValues?: {
    slug: string;
    title: string;
    category: string;
    dek: string;
    excerpt: string;
    body: string;
    publishedAt: string;
  };
};

export function AdminArticleForm({ mode, defaultValues }: Props) {
  const action = mode === "create" ? adminCreateArticleAction : adminUpdateArticleAction;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      )}
      {mode === "edit" && (
        <input type="hidden" name="originalSlug" value={defaultValues?.slug ?? ""} />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium md:col-span-1">
          slug（URL，小写+连字符）
          <input
            name="slug"
            required
            defaultValue={defaultValues?.slug}
            className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 font-mono text-sm"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
        </label>
        <label className="block text-sm font-medium">
          发布时间（ISO，可选）
          <input
            name="publishedAt"
            type="datetime-local"
            defaultValue={defaultValues?.publishedAt}
            className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="block text-sm font-medium">
        标题
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        栏目
        <select
          name="category"
          required
          defaultValue={defaultValues?.category}
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2"
        >
          {ARTICLE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        副标题 / dek
        <input name="dek" required defaultValue={defaultValues?.dek} className="mt-1 w-full rounded border border-rule bg-white px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        摘要 excerpt
        <textarea
          name="excerpt"
          required
          rows={3}
          defaultValue={defaultValues?.excerpt}
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        正文（Markdown）
        <textarea
          name="body"
          required
          rows={16}
          defaultValue={defaultValues?.body}
          className="mt-1 w-full rounded border border-rule bg-white px-3 py-2 font-mono text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "保存中…" : mode === "create" ? "创建" : "保存修改"}
      </button>
    </form>
  );
}
