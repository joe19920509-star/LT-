import { SECTIONS } from "@/lib/sections";

/** 后台 / Markdown 可选栏目（含历史分类） */
export const ARTICLE_CATEGORIES = [
  ...SECTIONS.map((s) => s.label),
  "Markets",
  "Asia",
  "Credit",
  "Commodities",
];
