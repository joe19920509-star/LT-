"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession, isAdminAuthenticated, adminPassword } from "@/lib/admin-session";
import { loadMarkdownArticlesSync } from "@/lib/articles";

const articleSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 只能用小写字母、数字和连字符"),
  title: z.string().min(1).max(300),
  category: z.string().min(1).max(120),
  dek: z.string().min(1).max(400),
  excerpt: z.string().min(1).max(800),
  body: z.string().min(1),
  publishedAt: z.string().optional(),
});

function revalidateArticlePaths(slug: string) {
  revalidatePath("/");
  revalidatePath(`/articles/${slug}`);
  revalidatePath("/account");
  for (const s of ["lab-to-market", "longterm-shortterm", "fast-slow"]) {
    revalidatePath(`/section/${s}`);
  }
}

export async function adminLoginAction(formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  const expected = adminPassword();
  if (!expected) {
    redirect("/admin/login?error=config");
  }
  if (pw !== expected) {
    redirect("/admin/login?error=auth");
  }
  const session = await getAdminSession();
  session.authenticated = true;
  await session.save();
  redirect("/admin/articles");
}

export async function adminLogoutAction() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}

export type AdminArticleFormState = { error?: string };

export async function adminCreateArticleAction(
  _prev: AdminArticleFormState | undefined,
  formData: FormData,
): Promise<AdminArticleFormState> {
  if (!(await isAdminAuthenticated())) return { error: "未登录" };
  const parsed = articleSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    category: formData.get("category"),
    dek: formData.get("dek"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    publishedAt: formData.get("publishedAt") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "校验失败" };
  }
  const d = parsed.data;
  if (loadMarkdownArticlesSync().some((a) => a.slug === d.slug)) {
    return { error: "该 slug 已被 Markdown 占用，请换 slug 或删除 content/articles 下对应文件" };
  }
  const exists = await prisma.article.findUnique({ where: { slug: d.slug } });
  if (exists) return { error: "slug 已存在" };
  const publishedAt = d.publishedAt ? new Date(d.publishedAt) : new Date();
  await prisma.article.create({
    data: {
      slug: d.slug,
      title: d.title,
      category: d.category,
      dek: d.dek,
      excerpt: d.excerpt,
      body: d.body,
      publishedAt,
    },
  });
  revalidateArticlePaths(d.slug);
  redirect("/admin/articles");
}

export async function adminUpdateArticleAction(
  _prev: AdminArticleFormState | undefined,
  formData: FormData,
): Promise<AdminArticleFormState> {
  if (!(await isAdminAuthenticated())) return { error: "未登录" };
  const originalSlug = String(formData.get("originalSlug") ?? "");
  const parsed = articleSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    category: formData.get("category"),
    dek: formData.get("dek"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    publishedAt: formData.get("publishedAt") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "校验失败" };
  }
  const d = parsed.data;
  const row = await prisma.article.findUnique({ where: { slug: originalSlug } });
  if (!row) return { error: "文章不存在" };
  if (d.slug !== originalSlug && loadMarkdownArticlesSync().some((a) => a.slug === d.slug)) {
    return { error: "目标 slug 已被 Markdown 占用" };
  }
  if (d.slug !== originalSlug) {
    const clash = await prisma.article.findUnique({ where: { slug: d.slug } });
    if (clash) return { error: "slug 已被其他数据库文章占用" };
  }
  const publishedAt = d.publishedAt ? new Date(d.publishedAt) : row.publishedAt;
  await prisma.article.update({
    where: { slug: originalSlug },
    data: {
      slug: d.slug,
      title: d.title,
      category: d.category,
      dek: d.dek,
      excerpt: d.excerpt,
      body: d.body,
      publishedAt,
    },
  });
  revalidateArticlePaths(d.slug);
  if (d.slug !== originalSlug) revalidateArticlePaths(originalSlug);
  redirect("/admin/articles");
}

export async function adminDeleteArticleAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) return;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;
  if (loadMarkdownArticlesSync().some((a) => a.slug === slug)) return;
  await prisma.article.deleteMany({ where: { slug } });
  revalidateArticlePaths(slug);
  redirect("/admin/articles");
}
