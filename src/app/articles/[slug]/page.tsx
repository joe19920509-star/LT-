import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isSubscriptionActive } from "@/lib/auth";
import { ArticleRichText, splitParagraphs } from "@/components/ArticleRichText";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return { title: "未找到" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) notFound();

  const user = await getCurrentUser();
  const fullAccess = user ? isSubscriptionActive(user) : false;
  const paras = splitParagraphs(article.body);
  const previewCount = Math.min(2, paras.length);
  const preview = paras.slice(0, previewCount);
  const locked = paras.slice(previewCount);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{article.category}</p>
      <h1 className="mt-2 font-display text-4xl font-black leading-tight md:text-5xl">{article.title}</h1>
      <p className="mt-4 font-display text-xl text-muted">{article.dek}</p>
      <p className="mt-6 text-sm text-muted">
        {article.publishedAt.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="article-body mt-10">
        <ArticleRichText paragraphs={preview} />
      </div>

      {!fullAccess && locked.length > 0 && (
        <div className="relative mt-8">
          <div
            className="article-body pointer-events-none max-h-[220px] overflow-hidden opacity-40 blur-[2px] select-none"
            aria-hidden
          >
            <ArticleRichText paragraphs={locked} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-paper via-paper/95 to-transparent pb-6 pt-24">
            <p className="max-w-md text-center text-sm font-medium text-ink">
              本文为订阅内容。注册并开通订阅后阅读全文。
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90"
              >
                注册
              </Link>
              <Link
                href="/login"
                className="rounded border border-rule bg-white px-4 py-2 text-sm font-semibold hover:bg-paper"
              >
                已有账号登录
              </Link>
              {user && !isSubscriptionActive(user) && (
                <Link
                  href="/subscribe"
                  className="rounded border border-accent px-4 py-2 text-sm font-semibold text-accent hover:bg-white"
                >
                  开通订阅
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {fullAccess && locked.length > 0 && (
        <div className="article-body mt-8">
          <ArticleRichText paragraphs={locked} />
        </div>
      )}

      {fullAccess && locked.length === 0 && preview.length > 0 && null}

      <div className="mt-12 border-t border-rule pt-8">
        <Link href="/" className="text-sm font-semibold text-muted hover:text-ink">
          ← 返回首页
        </Link>
      </div>
    </article>
  );
}
