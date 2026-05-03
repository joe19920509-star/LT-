import type { NextConfig } from "next";

/** Vercel 打包时把运行时 readFile 依赖打进对应路由，避免 opengraph-image 缺字体/Markdown 导致 500 */
const articleServerTraceIncludes = [
  "./content/articles/**/*.md",
  "./node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff2",
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
