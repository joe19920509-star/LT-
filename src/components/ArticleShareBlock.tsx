import QRCode from "qrcode";
import { ArticleSharePanel } from "@/components/ArticleSharePanel";

type Props = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
};

/** 服务端生成二维码 data URL，供桌面悬停「发微信」展示 */
export async function ArticleShareBlock({ url, title, description, imageUrl, slug }: Props) {
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 200,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#111111", light: "#ffffff" },
  });

  return (
    <section className="mt-6 border-b border-rule pb-6" aria-label="分享">
      <ArticleSharePanel
        url={url}
        title={title}
        description={description}
        imageUrl={imageUrl}
        slug={slug}
        qrDataUrl={qrDataUrl}
      />
    </section>
  );
}
