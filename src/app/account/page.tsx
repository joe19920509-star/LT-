import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isSubscriptionActive } from "@/lib/auth";
import { buildPersonalEdition } from "@/lib/edition";

export const metadata: Metadata = {
  title: "账户与今日看版",
};

const genderLabel: Record<string, string> = {
  male: "男",
  female: "女",
  other: "其他",
  prefer_not: "不愿透露",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const active = isSubscriptionActive(user);
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" }, take: 12 });

  const edition = buildPersonalEdition(
    {
      region: user.region,
      occupation: user.occupation,
      gender: user.gender,
      age: user.age,
    },
    articles,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-bold">账户</h1>

      <section className="mt-8 grid gap-8 border border-rule bg-white p-6 md:grid-cols-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted">注册资料</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4 border-b border-rule py-2">
              <dt className="text-muted">邮箱</dt>
              <dd className="text-right font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-rule py-2">
              <dt className="text-muted">手机</dt>
              <dd className="text-right font-medium">{user.phone}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-rule py-2">
              <dt className="text-muted">年龄</dt>
              <dd className="text-right font-medium">{user.age}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-rule py-2">
              <dt className="text-muted">性别</dt>
              <dd className="text-right font-medium">{genderLabel[user.gender] ?? user.gender}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-rule py-2">
              <dt className="text-muted">地区</dt>
              <dd className="text-right font-medium">{user.region}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-muted">职业</dt>
              <dd className="text-right font-medium">{user.occupation}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted">订阅状态</h2>
          <p className="mt-4 text-lg font-semibold">
            {active ? "订阅有效" : "未订阅或已过期"}
          </p>
          {user.subscriptionEndsAt && (
            <p className="mt-2 text-sm text-muted">
              到期日：{user.subscriptionEndsAt.toLocaleDateString("zh-CN")}
            </p>
          )}
          {!active && (
            <Link
              href="/subscribe"
              className="mt-4 inline-block rounded bg-ink px-4 py-2 text-sm font-semibold text-paper"
            >
              去开通订阅
            </Link>
          )}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-2">
          <div>
            <h2 className="font-display text-2xl font-bold">{edition.headline}</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted">{edition.subline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {edition.tags.map((t) => (
              <span key={t} className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>

        {!active && (
          <p className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            开通订阅后，下方列表顺序与深度分析将同步至全文阅读体验。{" "}
            <Link href="/subscribe" className="font-semibold underline">
              立即订阅
            </Link>
          </p>
        )}

        <ol className="grid list-decimal gap-6 pl-5 md:grid-cols-2">
          {edition.ordered.map((a) => (
            <li key={a.id} className="marker:font-display marker:text-accent">
              <article>
                <p className="text-xs font-semibold uppercase text-muted">{a.category}</p>
                <Link href={`/articles/${a.slug}`} className="group">
                  <h3 className="mt-1 font-display text-xl font-bold leading-snug group-hover:underline">{a.title}</h3>
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{a.dek}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
