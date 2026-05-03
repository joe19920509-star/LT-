import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";

export const alt = "LT Magazine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Node 运行时：中文字体较大，避免 Edge 内存/外网字体链失败导致分享图 500 */
export const runtime = "nodejs";

const NOTO_SC_700_REMOTE =
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.2.5/files/noto-sans-sc-chinese-simplified-700-normal.woff2";

const NOTO_SC_700_LOCAL = join(
  process.cwd(),
  "node_modules",
  "@fontsource",
  "noto-sans-sc",
  "files",
  "noto-sans-sc-chinese-simplified-700-normal.woff2",
);

function bufferToArrayBuffer(buf: Buffer): ArrayBuffer {
  const sliced = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return sliced as ArrayBuffer;
}

async function loadChineseFont(): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(NOTO_SC_700_LOCAL);
    return bufferToArrayBuffer(buf);
  } catch {
    /* 本地缺失时回退 CDN（例如非常规部署路径） */
  }
  try {
    const res = await fetch(NOTO_SC_700_REMOTE, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ slug: string }> };

function ogImageResponse(
  title: string,
  category: string,
  fonts: readonly [{ name: string; data: ArrayBuffer; weight: 700; style: "normal" }] | undefined,
) {
  const titleSize = title.length > 42 ? 52 : title.length > 28 ? 60 : 68;
  const fontFamily = fonts ? "Noto Sans SC" : "system-ui";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#111111",
          padding: 56,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              background: "#b8860b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111111",
              fontSize: 40,
              fontWeight: 800,
              fontFamily,
            }}
          >
            LT
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span
              style={{
                color: "#b8860b",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 6,
                fontFamily,
              }}
            >
              LT MAGAZINE
            </span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 22, fontFamily }}>ltmagazine.cn</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            marginTop: 36,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: "#fafafa",
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.25,
              maxWidth: 1080,
              maxHeight: 280,
              overflow: "hidden",
              fontFamily,
            }}
          >
            {title}
          </div>
        </div>

        {category ? (
          <div
            style={{
              color: "#b8860b",
              fontSize: 26,
              fontWeight: 600,
              borderTop: "1px solid rgba(184,134,11,0.35)",
              paddingTop: 20,
              fontFamily,
            }}
          >
            {category}
          </div>
        ) : null}
      </div>
    ),
    {
      ...size,
      fonts: fonts ? [...fonts] : undefined,
    },
  );
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof getArticleBySlug>> = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    article = null;
  }

  const fontData = await loadChineseFont();
  const fonts = fontData
    ? ([
        { name: "Noto Sans SC", data: fontData, weight: 700 as const, style: "normal" as const },
      ] as const)
    : undefined;

  const title = article?.title ?? "LT Magazine";
  const category = article?.category ?? "";

  try {
    return ogImageResponse(title, category, fonts);
  } catch {
    /** 缺 CJK 字体时 Satori 可能对中文抛错，降级为纯英文占位，避免分享链 500 */
    return ogImageResponse("LT Magazine", "", undefined);
  }
}
