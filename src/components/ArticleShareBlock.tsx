import QRCode from "qrcode";
import { ArticleSharePanel } from "@/components/ArticleSharePanel";

type Props = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
};

/** 服务端生成二维码，避免第三方图床；内容为文章 URL，供微信内扫码打开后再分享 */
export async function ArticleShareBlock({ url, title, description, imageUrl, slug }: Props) {
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 216,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#111111", light: "#ffffff" },
  });

  return (
    <section className="mt-6 flex flex-col gap-5 border-b border-rule pb-6 sm:flex-row sm:items-start sm:gap-8" aria-label="分享">
      <figure className="shrink-0 rounded border border-rule bg-white p-3 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element -- data URL from qrcode */}
        <img src={qrDataUrl} width={216} height={216} alt="" className="block h-[216px] w-[216px]" />
        <figcaption className="mt-2 max-w-[216px] text-center text-[11px] leading-snug text-muted">
          微信扫一扫打开本文，再点右上角即可分享带缩略图的链接。
        </figcaption>
      </figure>
      <div className="min-w-0 flex-1 pt-1">
        <ArticleSharePanel url={url} title={title} description={description} imageUrl={imageUrl} slug={slug} />
      </div>
    </section>
  );
}
