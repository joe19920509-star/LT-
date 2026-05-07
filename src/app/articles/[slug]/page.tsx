import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { getPublicSiteUrl } from "@/lib/site-url";
import { getCurrentUser, isSubscriptionActive } from "@/lib/auth";
import { splitParagraphs } from "@/components/ArticleRichText";
import { MarkdownBody } from "@/components/MarkdownBody";
import { ArticleShareBlock } from "@/components/ArticleShareBlock";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "未找到" };

  const base = getPublicSiteUrl();
  const articlePath = `/articles/${slug}`;
  const articleUrl = `${base}${articlePath}`;
  const imageUrl = `${base}${articlePath}/opengraph-image`;

  return {
    title: article.title,
    description: article.excerpt,
    metadataBase: new URL(base),
    alternates: { canonical: articleUrl },
    openGraph: {
      type: "article",
      locale: "zh_CN",
      siteName: "LT",
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      publishedTime: article.publishedAt.toISOString(),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const user = await getCurrentUser();
  const subscriptionOk = user ? isSubscriptionActive(user) : false;
  const fullAccess = !article.requiresSubscription || subscriptionOk;
  const paras = splitParagraphs(article.body);
  const previewCount = Math.min(2, paras.length);
  const preview = paras.slice(0, previewCount);
  const locked = paras.slice(previewCount);
  const previewMd = preview.join("\n\n");
  const lockedMd = locked.join("\n\n");

  const base = getPublicSiteUrl();
  const articlePath = `/articles/${slug}`;
  const articleUrl = `${base}${articlePath}`;
  const shareImageUrl = `${base}${articlePath}/opengraph-image`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <ArticleJsonLd
        headline={article.title}
        description={article.excerpt}
        imageUrl={shareImageUrl}
        pageUrl={articleUrl}
        datePublished={article.publishedAt.toISOString()}
        siteOrigin={base}
      />
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{article.category}</p>
      <h1 className="mt-2 font-display text-4xl font-black leading-tight md:text-5xl">{article.title}</h1>
      <p className="mt-4 font-display text-xl text-muted">{article.dek}</p>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>
          {article.publishedAt.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {article.requiresSubscription && (
          <span className="rounded border border-accent/40 bg-accent/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
            订阅可读全文
          </span>
        )}
      </div>

      <ArticleShareBlock
        url={articleUrl}
        title={article.title}
        description={article.excerpt}
        imageUrl={shareImageUrl}
        slug={slug}
      />

      {fullAccess ? (
        <div className="article-md mt-10">
          <MarkdownBody content={article.body} />
        </div>
      ) : (
        <>
          <div className="article-md mt-10">
            <MarkdownBody content={previewMd} />
          </div>
          {locked.length > 0 && (
            <div className="relative mt-8">
              <div
                className="article-md pointer-events-none max-h-[220px] overflow-hidden opacity-40 blur-[2px] select-none"
                aria-hidden
              >
                <MarkdownBody content={lockedMd} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-white via-white/95 to-transparent pb-6 pt-24">
                <p className="max-w-md text-center text-sm font-medium text-ink">
                  本文为订阅专享。注册并开通订阅后阅读全文。
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
                    className="rounded border border-rule bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
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
        </>
      )}

      <div className="mt-12 border-t border-rule pt-8">
        <Link href="/" className="text-sm font-semibold text-muted hover:text-ink">
          ← 返回首页
        </Link>
      </div>
    </article>
  );
}
