/**
 * 首页头条（banner）：按发布时间最新的一篇（与 getAllArticles 排序一致：publishedAt 降序）。
 * 「最新报道」区展示紧随其后的 7 篇。
 */
export function pickHomeLeadAndRest<T extends { slug: string }>(
  articles: T[],
): { lead: T | undefined; rest: T[] } {
  if (articles.length === 0) return { lead: undefined, rest: [] };
  const lead = articles[0];
  const rest = articles.slice(1, 8);
  return { lead, rest };
}
