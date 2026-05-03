import type { NextConfig } from "next";

/** Vercel 打包时把运行时 readFile 依赖打进对应路由，避免 opengraph-image 缺字体/Markdown 导致 500 */
const articleServerTraceIncludes = [
  "./content/articles/**/*.md",
  "./node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff2",
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Next 15 默认对「非爬虫」浏览器流式输出 metadata，`og:*` 会出现在 `</head>` 之后。
   * 微信拉链接预览不执行 JS、且只扫初始 `<head>`，导致聊天/朋友圈一直只有裸链。
   * 对所有 UA 阻塞 metadata，使 Open Graph 进入首包 `<head>`（略增 TTFB，换分享卡片可用）。
   */
  htmlLimitedBots: /.*/,
  outputFileTracingIncludes: {
    "/articles/[slug]": [...articleServerTraceIncludes],
    "/articles/[slug]/opengraph-image": [...articleServerTraceIncludes],
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icon" },
      { source: "/favicon.png", destination: "/icon" },
    ];
  },
};

export default nextConfig;
