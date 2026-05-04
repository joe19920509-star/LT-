import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import type { EditionPillar } from "@/lib/edition-types";

export type RawExternalItem = {
  id: string;
  title: string;
  category: EditionPillar;
  sourceLabel: string;
  /** ISO 8601，便于 unstable_cache 序列化 */
  publishedAt: string;
  snippet: string;
};

type FeedDef = {
  url: string;
  /** 对用户展示的出处名（对应你列出的主流媒体） */
  sourceLabel: string;
  category: EditionPillar;
};

/**
 * 公开 RSS 列表：不抓取整站 HTML，避免付费墙与合规风险。
 * 部分源若临时不可用会在合并阶段被其它源补足。
 * （财联社等若无稳定公开 RSS，用同栏目的其它源代替。）
 */
const FEEDS: FeedDef[] = [
  { url: "https://www.chinadaily.com.cn/rss/china_rss.xml", sourceLabel: "China Daily", category: "新闻" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", sourceLabel: "纽约时报", category: "新闻" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", sourceLabel: "纽约时报", category: "财经" },
  { url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml", sourceLabel: "WSJ", category: "财经" },
  { url: "https://feeds.a.dj.com/rss/RSSWorldNews.xml", sourceLabel: "WSJ", category: "新闻" },
  { url: "https://www.vogue.com/feed/rss", sourceLabel: "Vogue", category: "时尚" },
  { url: "https://www.gq.com/feed/rss", sourceLabel: "GQ", category: "时尚" },
  { url: "https://www.wallpaper.com/feed/rss", sourceLabel: "Wallpaper", category: "时尚" },
  { url: "https://www.cgtn.com/subscribe/rss/news.xml", sourceLabel: "央视新闻", category: "新闻" },
  { url: "https://en.people.cn/rss/world.xml", sourceLabel: "人民日报", category: "新闻" },
  { url: "https://en.people.cn/rss/business.xml", sourceLabel: "人民日报", category: "财经" },
  /* 解放日报/上观等若后续有稳定 HTTPS RSS，可在此追加 */
  { url: "https://www.yicai.com/rss.xml", sourceLabel: "第一财经", category: "财经" },
  { url: "https://rss.sina.com.cn/roll/finance/hot_roll.xml", sourceLabel: "新浪财经", category: "财经" },
];

const parser = new Parser({
  timeout: 12000,
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (compatible; LT-Magazine/1.1; +https://ltmagazine.cn) AppleWebKit/537.36 (KHTML, like Gecko)",
  },
});

function slugId(title: string, source: string): string {
  const t = `${source}|${title}`.slice(0, 120);
  let h = 0;
  for (let i = 0; i < t.length; i++) h = (Math.imul(31, h) + t.charCodeAt(i)) | 0;
  return `ext:${(h >>> 0).toString(16)}`;
}

function parseItemDate(item: { isoDate?: string; pubDate?: string }): Date | null {
  if (item.isoDate) {
    const d = new Date(item.isoDate);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (item.pubDate) {
    const d = new Date(item.pubDate);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

/** 上海日历日 YYYY-MM-DD */
function shanghaiYmd(d: Date): string {
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Shanghai" });
}

function isWithinRecentWindow(pub: Date, hours: number): boolean {
  const ms = hours * 3600 * 1000;
  const now = Date.now();
  return pub.getTime() <= now + 3600 * 1000 && pub.getTime() >= now - ms;
}

/** 上海日历上的「昨天」（与 shanghaiYmd 一致） */
function prevShanghaiCalendarDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  let dd = d - 1;
  let mm = m;
  let yy = y;
  if (dd < 1) {
    mm -= 1;
    if (mm < 1) {
      mm = 12;
      yy -= 1;
    }
    /* mm 为 1–12 人类月份：取该月最后一天 */
    dd = new Date(yy, mm + 1, 0).getDate();
  }
  return `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

/** 优先「上海昨日」 */
export function isPreferredNewsDay(pubIso: string): boolean {
  const pub = new Date(pubIso);
  if (Number.isNaN(pub.getTime())) return false;
  const yestSh = prevShanghaiCalendarDay(shanghaiYmd(new Date()));
  return shanghaiYmd(pub) === yestSh;
}

async function fetchOneFeed(def: FeedDef): Promise<RawExternalItem[]> {
  try {
    const feed = await parser.parseURL(def.url);
    const out: RawExternalItem[] = [];
    for (const item of feed.items ?? []) {
      const title = (item.title ?? "").trim();
      if (!title) continue;
      const pub = parseItemDate(item);
      if (!pub || !isWithinRecentWindow(pub, 96)) continue;
      const snippet = (item.contentSnippet ?? item.summary ?? "").replace(/\s+/g, " ").trim().slice(0, 160);
      out.push({
        id: slugId(title, def.sourceLabel),
        title,
        category: def.category,
        sourceLabel: def.sourceLabel,
        publishedAt: pub.toISOString(),
        snippet,
      });
    }
    return out;
  } catch {
    return [];
  }
}

async function fetchAllFeedsUncached(): Promise<RawExternalItem[]> {
  const chunks = await Promise.all(FEEDS.map((f) => fetchOneFeed(f)));
  return chunks.flat();
}

function shanghaiDayKey(): string {
  return shanghaiYmd(new Date());
}

/** 按自然日缓存，全站用户共享同一份池子，减少对外站压力 */
export async function getExternalRssPool(): Promise<RawExternalItem[]> {
  const cached = unstable_cache(fetchAllFeedsUncached, ["external-rss-v1", shanghaiDayKey()], {
    revalidate: 3600,
  });
  return cached();
}

export function dedupeExternals(items: RawExternalItem[]): RawExternalItem[] {
  const seen = new Set<string>();
  const out: RawExternalItem[] = [];
  for (const x of items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )) {
    const key = x.title.toLowerCase().replace(/\s+/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(x);
  }
  return out;
}

export function preferYesterdayFirst(items: RawExternalItem[]): RawExternalItem[] {
  return [...items].sort((a, b) => {
    const ay = isPreferredNewsDay(a.publishedAt) ? 1 : 0;
    const by = isPreferredNewsDay(b.publishedAt) ? 1 : 0;
    if (by !== ay) return by - ay;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}
