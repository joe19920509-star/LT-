import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export type OgArticleInfo = { title: string; category: string };

/** 先 Markdown（同步），未命中再尝试数据库（避免 OG 路由静态 import 整条 articles + Prisma） */
export function getMarkdownArticleInfoForOg(slug: string): OgArticleInfo | null {
  if (!fs.existsSync(ARTICLES_DIR)) return null;
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data } = matter(raw);
    if (String(data.slug ?? "").trim() !== slug) continue;
    return {
      title: String(data.title ?? "Untitled"),
      category: String(data.category ?? ""),
    };
  }
  return null;
}

export async function getArticleInfoForOg(slug: string): Promise<OgArticleInfo | null> {
  const fromMd = getMarkdownArticleInfoForOg(slug);
  if (fromMd) return fromMd;
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.article.findUnique({
      where: { slug },
      select: { title: true, category: true },
    });
    if (!row) return null;
    return { title: row.title, category: row.category };
  } catch {
    return null;
  }
}
