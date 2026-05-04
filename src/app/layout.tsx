import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { getPublicSiteUrl } from "@/lib/site-url";

const display = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-display",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon",
    shortcut: "/icon",
  },
  title: {
    default: "LT | 财经订阅阅读",
    template: "%s | LT",
  },
  description:
    "ltmagazine.cn — 订阅制财经内容：市场、信用、亚太与大宗商品。注册订阅后解锁全文与个性化今日看版。",
  keywords: [
    "LT",
    "财经杂志",
    "订阅阅读",
    "ltmagazine",
    "市场",
    "信用",
    "亚太",
    "大宗商品",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    other: {
      "baidu-site-verification": "codeva-HuPszVqRWy",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "LT",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "LT | 财经订阅阅读",
    description:
      "订阅制财经内容：市场、信用、亚太与大宗商品。注册订阅后解锁全文。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteJsonLd />
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
