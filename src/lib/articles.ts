import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article as DbArticle } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

/** 列表 / 详情 / 看版 统一结构（Markdown 与数据库合并，同 slug 以 Markdown 为准） */
export type ListedArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  dek: string;
  excerpt: string;
  body: string;
  publishedAt: Date;
  /** true：需有效订阅才读全文；false：公开可读（默认） */
  requiresSubscription: boolean;
  source: "markdown" | "database";
};

function parseDate(raw: unknown): Date {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  if (typeof raw === "string" || typeof raw === "number") {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

/** Markdown front matter：`requiresSubscription: true` 为订阅专享；缺省为公开全文 */
function parseRequiresSubscription(raw: unknown): boolean {
  if (raw === true) return true;
  if (typeof raw === "string" && raw.toLowerCase() === "true") return true;
  if (raw === 1) return true;
  return false;
}

export function loadMarkdownArticlesSync(): ListedArticle[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const out: ListedArticle[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = String(data.slug ?? "").trim();
    if (!slug) continue;
    out.push({
      id: `md:${slug}`,
      slug,
      title: String(data.title ?? "Untitled"),
      category: String(data.category ?? "Markets"),
      dek: String(data.dek ?? ""),
      excerpt: String(data.excerpt ?? ""),
      body: content.trim(),
      publishedAt: parseDate(data.publishedAt),
      requiresSubscription: parseRequiresSubscription(data.requiresSubscription),
      source: "markdown",
    });
  }
  return out;
}

function dbRowToListed(a: DbArticle): ListedArticle {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    dek: a.dek,
    excerpt: a.excerpt,
    body: a.body,
    publishedAt: a.publishedAt,
    requiresSubscription: a.requiresSubscription,
    source: "database",
  };
}

async function loadDbArticles(): Promise<ListedArticle[]> {
  const rows = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });
  return rows.map(dbRowToListed);
}

/** 合并稿源：Markdown 覆盖同 slug 的数据库稿 */
export async function getAllArticles(): Promise<ListedArticle[]> {
  const md = loadMarkdownArticlesSync();
  const db = await loadDbArticles();
  const map = new Map<string, ListedArticle>();
  for (const a of db) map.set(a.slug, a);
  for (const a of md) map.set(a.slug, a);
  return [...map.values()].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getArticleBySlug(slug: string): Promise<ListedArticle | null> {
  const mdList = loadMarkdownArticlesSync();
  const fromMd = mdList.find((a) => a.slug === slug);
  if (fromMd) return fromMd;
  const row = await prisma.article.findUnique({ where: { slug } });
  return row ? dbRowToListed(row) : null;
}

/** 仅数据库中的文章（后台管理列表） */
export async function getDbArticlesOnly(): Promise<ListedArticle[]> {
  return loadDbArticles();
}
