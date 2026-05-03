/** 栏目：URL slug ↔ 数据库 Article.category 精确匹配 */
export const SECTIONS = [
  {
    slug: "lab-to-market",
    label: "Lab to Market",
    blurb: "实验室成果、技术转化与早期商业化。",
  },
  {
    slug: "longterm-shortterm",
    label: "LongTerm & ShortTerm",
    blurb: "长周期配置与短周期交易信号的交叉观察。",
  },
  {
    slug: "fast-slow",
    label: "Fast & Slow",
    blurb: "流动性、风格轮动与「快变量 / 慢变量」对照。",
  },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]["slug"];

export function getSectionBySlug(slug: string) {
  return SECTIONS.find((s) => s.slug === slug) ?? null;
}
