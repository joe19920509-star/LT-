/** 对外站点根 URL，用于 OG / canonical（勿尾斜杠） */
export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ltmagazine.cn";
  return raw.replace(/\/+$/, "");
}
