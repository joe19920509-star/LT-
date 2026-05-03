import type { Article } from "@prisma/client";

type UserEditionInput = {
  region: string;
  occupation: string;
  gender: string;
  age: number;
};

/** 根据用户画像生成「今日看版」导语与排序权重（规则引擎，可后续接推荐服务） */
export function buildPersonalEdition(
  user: UserEditionInput,
  articles: Article[],
): {
  headline: string;
  subline: string;
  ordered: Article[];
  tags: string[];
} {
  const tags: string[] = [];
  if (/金融|银行|投资|证券|基金|保险/.test(user.occupation)) {
    tags.push("机构视角", "利率与信用");
  } else if (/科技|互联网|软件|数据/.test(user.occupation)) {
    tags.push("全球供应链", "成长股");
  } else {
    tags.push("宏观简报", "跨资产");
  }
  if (/北京|上海|广东|深圳|香港/.test(user.region)) {
    tags.push("亚太盘前");
  }

  const weights = new Map<string, number>();
  for (const a of articles) {
    let w = 0;
    if (a.category === "Asia" && /亚洲|中国|香港|日本|韩国|新/.test(user.region)) w += 3;
    if (a.category === "Markets" && tags.some((t) => t.includes("利率"))) w += 2;
    if (a.category === "Credit" && tags.some((t) => t.includes("信用"))) w += 2;
    if (user.age >= 45 && a.category === "Markets") w += 1;
    weights.set(a.id, w);
  }

  const ordered = [...articles].sort(
    (a, b) => (weights.get(b.id) ?? 0) - (weights.get(a.id) ?? 0),
  );

  const headline = `LT 财经 · 您的今日看版`;
  const subline = `${user.region} · ${user.occupation} · 根据您的画像优先展示 ${tags.slice(0, 2).join("、")} 相关内容`;

  return { headline, subline, ordered, tags };
}
