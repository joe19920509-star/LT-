import type { ListedArticle } from "@/lib/articles";
import type { EditionBoardData, EditionItem, EditionItemExternal, EditionPillar } from "@/lib/edition-types";
import {
  dedupeExternals,
  getExternalRssPool,
  isPreferredNewsDay,
  preferYesterdayFirst,
  type RawExternalItem,
} from "@/lib/external-rss-pool";
import { SECTIONS } from "@/lib/sections";

export type UserEditionInput = {
  region: string;
  occupation: string;
  gender: string;
  age: number;
};

const sectionLabels = new Set<string>(SECTIONS.map((s) => s.label));

function occupationPillarBoost(occupation: string): Record<EditionPillar, number> {
  if (/金融|银行|投资|证券|基金|保险|财务|会计|经济|财富|量化|交易/.test(occupation)) {
    return { 时尚: 1, 新闻: 1.25, 财经: 2.2 };
  }
  if (/时尚|设计|艺术|服装|美妆|造型|模特|创意|品牌|买手|零售/.test(occupation)) {
    return { 时尚: 2.2, 新闻: 1, 财经: 1 };
  }
  if (/媒体|记者|编辑|出版|新闻|公关|政府|法律|教师|学生/.test(occupation)) {
    return { 时尚: 1.15, 新闻: 2, 财经: 1.1 };
  }
  if (/科技|互联网|软件|数据|工程师|研发|产品|算法/.test(occupation)) {
    return { 时尚: 1, 新闻: 1.35, 财经: 1.55 };
  }
  return { 时尚: 1, 新闻: 1.2, 财经: 1.2 };
}

function scoreExternal(x: RawExternalItem, boost: Record<EditionPillar, number>): number {
  const t = new Date(x.publishedAt).getTime();
  const hours = (Date.now() - t) / 3600000;
  const recency = Math.max(0, 72 - hours) / 72;
  const pillar = boost[x.category] ?? 1;
  const yBonus = isPreferredNewsDay(x.publishedAt) ? 0.45 : 0;
  return pillar * 3.2 + recency * 4 + yBonus;
}

function buildTags(user: UserEditionInput): string[] {
  const tags: string[] = ["外稿·RSS", "昨日要闻优先"];
  if (/金融|银行|投资|证券|基金|保险/.test(user.occupation)) {
    tags.push("财经加权");
  } else if (/时尚|设计|艺术|服装|美妆/.test(user.occupation)) {
    tags.push("时尚加权");
  } else if (/媒体|记者|编辑|新闻|公关/.test(user.occupation)) {
    tags.push("新闻加权");
  } else if (/科技|互联网|软件|数据|工程师|产品/.test(user.occupation)) {
    tags.push("新闻+财经");
  } else {
    tags.push("综合推荐");
  }
  if (/北京|上海|广东|深圳|香港|浙江|江苏/.test(user.region)) {
    tags.push("国内视角");
  }
  return tags;
}

function internalSortWeight(a: ListedArticle, user: UserEditionInput): number {
  let w = 0;
  if (sectionLabels.has(a.category)) w += 4;
  if (/金融|投资|证券|基金|银行|保险/.test(user.occupation)) {
    if (/market|credit|长期|短期|lab|market|fast|slow/i.test(a.category + a.title)) w += 2;
    if (a.category === "LongTerm & ShortTerm" || a.category === "Lab to Market") w += 1;
  }
  if (/科技|互联网|软件|数据|工程师|产品/.test(user.occupation) && a.category === "Lab to Market") w += 2;
  if (/北京|上海|广东|深圳|香港/.test(user.region) && /亚太|asia|china/i.test(a.category + a.title)) w += 1;
  if (user.age >= 45 && a.category === "LongTerm & ShortTerm") w += 1;
  w += Math.min(3, a.publishedAt.getTime() / 1e12);
  return w;
}

function toExternalEditionItem(x: RawExternalItem): EditionItemExternal {
  const tail = x.snippet ? `${x.snippet} · 来源：${x.sourceLabel}` : `来源：${x.sourceLabel}`;
  return {
    kind: "external",
    id: x.id,
    category: x.category,
    title: x.title,
    dek: tail,
  };
}

function pickExternals(occupation: string, pool: RawExternalItem[], need: number): EditionItemExternal[] {
  const boost = occupationPillarBoost(occupation);
  const ranked = preferYesterdayFirst(dedupeExternals(pool))
    .map((x) => ({ x, s: scoreExternal(x, boost) }))
    .sort((a, b) => b.s - a.s);
  const seen = new Set<string>();
  const out: EditionItemExternal[] = [];
  for (const { x } of ranked) {
    if (out.length >= need) break;
    if (seen.has(x.id)) continue;
    seen.add(x.id);
    out.push(toExternalEditionItem(x));
  }
  return out;
}

function pickTopInternalArticles(articles: ListedArticle[], user: UserEditionInput, need: number): ListedArticle[] {
  const sorted = [...articles].sort(
    (a, b) => internalSortWeight(b, user) - internalSortWeight(a, user),
  );
  return sorted.slice(0, need);
}

function mergeOrdered(
  internalRows: ListedArticle[],
  externals: EditionItemExternal[],
  user: UserEditionInput,
): EditionItem[] {
  const scoredInt = internalRows.map((a) => {
    const it: EditionItem = {
      kind: "internal",
      slug: a.slug,
      category: a.category,
      title: a.title,
      dek: a.dek,
    };
    return { it, score: 950 + internalSortWeight(a, user) };
  });
  const scoredExt = externals.map((it, i) => ({ it, score: 420 - i * 0.5 }));
  const merged = [...scoredInt, ...scoredExt].sort((a, b) => b.score - a.score).map((x) => x.it);
  return merged.slice(0, 10);
}

/** 8 条外站 RSS + 2 条站内；外稿不可跳转，副标题含出处 */
export async function buildPersonalEdition(
  user: UserEditionInput,
  articles: ListedArticle[],
): Promise<EditionBoardData> {
  const tags = buildTags(user);
  const pool = await getExternalRssPool();
  const externals = pickExternals(user.occupation, pool, 8);
  const internalRows = pickTopInternalArticles(articles, user, 2);
  const ordered = mergeOrdered(internalRows, externals, user);

  const headline = `LT · 您的今日看版`;
  const subline = `${user.region} · ${user.occupation} · 外稿来自公开 RSS（优先上海昨日），按职业对「时尚 / 新闻 / 财经」加权；右侧两条为站内原创，可点进全文。`;

  return { headline, subline, ordered, tags };
}
