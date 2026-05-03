/** 栏目：URL slug ↔ 数据库 Article.category 精确匹配 */
export const SECTIONS = [
  {
    slug: "lab-to-market",
    label: "Lab to Market",
    blurb: "从实验室到华尔街，一件事是怎么变成一门生意的。",
  },
  {
    slug: "longterm-shortterm",
    label: "LongTerm & ShortTerm",
    blurb: "用长期结构看短期机会，用短期心跳测长期方向。",
  },
  {
    slug: "fast-slow",
    label: "Fast & Slow",
    blurb: "热点发生的时候，我们先冲进去，再退出来想清楚。",
  },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]["slug"];

export function getSectionBySlug(slug: string) {
  return SECTIONS.find((s) => s.slug === slug) ?? null;
}
