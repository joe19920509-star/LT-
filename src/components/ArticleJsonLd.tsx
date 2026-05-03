/** 供爬虫读取的结构化数据（含 image），部分客户端链接预览会参考 */
export function ArticleJsonLd(props: {
  headline: string;
  description: string;
  imageUrl: string;
  pageUrl: string;
  datePublished: string;
  siteOrigin: string;
}) {
  const { headline, description, imageUrl, pageUrl, datePublished, siteOrigin } = props;
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    image: [imageUrl],
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    url: pageUrl,
    datePublished,
    author: { "@type": "Organization", name: "LT Magazine" },
    publisher: {
      "@type": "Organization",
      name: "LT Magazine",
      logo: { "@type": "ImageObject", url: `${siteOrigin}/icon` },
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
