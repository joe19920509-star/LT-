/** 首页头条（banner）固定文章 slug；未在列表中出现时退回时间排序第一篇 */
export const HOME_BANNER_SLUG = "travel-paradox";

export function pickHomeLeadAndRest<T extends { slug: string }>(
  articles: T[],
): { lead: T | undefined; rest: T[] } {
  if (articles.length === 0) return { lead: undefined, rest: [] };
  const i = articles.findIndex((a) => a.slug === HOME_BANNER_SLUG);
  if (i === -1) {
    return { lead: articles[0], rest: articles.slice(1) };
  }
  const lead = articles[i];
  const rest = [...articles.slice(0, i), ...articles.slice(i + 1)];
  return { lead, rest };
}
