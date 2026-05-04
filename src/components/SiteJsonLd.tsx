import { getPublicSiteUrl } from "@/lib/site-url";

/** 全站 Organization + WebSite 结构化数据（首页与各页共用一份即可） */
export function SiteJsonLd() {
  const siteUrl = getPublicSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "LT Magazine",
        url: siteUrl,
        logo: `${siteUrl}/icon`,
      },
      {
        "@type": "WebSite",
        name: "LT Magazine",
        url: siteUrl,
        inLanguage: "zh-CN",
        publisher: { "@type": "Organization", name: "LT Magazine" },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
