import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const display = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-display",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ltmagazine.cn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon",
    shortcut: "/icon",
  },
  title: {
    default: "LT Magazine | 财经订阅阅读",
    template: "%s | LT Magazine",
  },
  description:
    "ltmagazine.cn — 订阅制财经内容：市场、信用、亚太与大宗商品。注册订阅后解锁全文与个性化今日看版。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "LT Magazine",
    url: siteUrl,
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
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
