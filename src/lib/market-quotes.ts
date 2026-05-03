/**
 * 服务端抓取行情（东方财富 push2，约 60s 缓存）。
 * secid：沪 1.xxxxxx、深 0.xxxxxx、外盘/指数常见 100.xxx。
 * QDII 无单一官方指数，此处用纳指 QDII ETF（513100）作代理，可在 STRIP 中改 secid。
 */
const STRIP = [
  { label: "上证指数", secid: "1.000001" },
  { label: "深证指数", secid: "0.399001" },
  { label: "QDII指数", secid: "1.513100" },
  { label: "美元指数", secid: "100.UDI" },
] as const;

export type StripRow = { label: string; value: string };

type EmResponse = {
  rc?: number;
  data?: { f43?: number; f58?: string };
};

/** 东财 f43：指数 / A 股现价多为「实际价格 ×100」的整数 */
function decodePrice(raw: number | undefined): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw === 0) return null;
  return raw / 100;
}

async function eastMoneyLastPrice(secid: string): Promise<number | null> {
  const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${encodeURIComponent(secid)}&fields=f43,f58`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        Referer: "https://quote.eastmoney.com/",
        "User-Agent":
          "Mozilla/5.0 (compatible; LT-Magazine/1.0; +https://ltmagazine.cn)",
      },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as EmResponse;
    if (j.rc !== 0 || !j.data) return null;
    return decodePrice(j.data.f43);
  } catch {
    return null;
  }
}

function formatPrice(label: string, n: number | null): string {
  if (n === null) return "—";
  if (label === "美元指数") {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function getMarketStrip(): Promise<StripRow[]> {
  const results = await Promise.all(
    STRIP.map(async (row) => {
      const price = await eastMoneyLastPrice(row.secid);
      return {
        label: row.label,
        value: formatPrice(row.label, price),
      };
    }),
  );
  return results;
}
