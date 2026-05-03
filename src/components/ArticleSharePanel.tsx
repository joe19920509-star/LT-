"use client";

import { useCallback, useMemo, useState } from "react";

type Props = {
  url: string;
  title: string;
  description: string;
  /** 与 generateMetadata 中 og:image 一致，用于保存为 PNG 发朋友圈配图 */
  imageUrl: string;
  slug: string;
};

function isWeChatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

export function ArticleSharePanel({ url, title, description, imageUrl, slug }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const inWeChat = useMemo(() => isWeChatBrowser(), []);
  const canNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const copyForWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash(inWeChat ? "已复制。若对方只见网址，请其点开链接，或用「分享图」发封面。" : "已复制");
    } catch {
      flash("请长按选中地址栏链接复制");
    }
  }, [url, flash, inWeChat]);

  const nativeShare = useCallback(async () => {
    if (!navigator.share) {
      await copyForWeChat();
      return;
    }
    try {
      await navigator.share({ title, text: description || title, url });
    } catch (e) {
      const err = e as { name?: string };
      if (err?.name === "AbortError") return;
      await copyForWeChat();
    }
  }, [title, description, url, copyForWeChat]);

  const saveShareImage = useCallback(async () => {
    const safeName = `LT-${slug.replace(/[^\w.-]+/g, "-")}.png`;
    try {
      const res = await fetch(imageUrl, { mode: "cors", credentials: "omit", cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = safeName;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      flash("已保存");
    } catch {
      window.open(imageUrl, "_blank", "noopener,noreferrer");
      flash("已打开图片，请长按保存");
    }
  }, [imageUrl, slug, flash]);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-rule pb-6" aria-label="分享">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">分享</span>
      <button
        type="button"
        title="复制链接。聊天里若只显示成一串网址，多为微信未展开；请对方点击打开，或使用本页「分享图」发图片。"
        onClick={copyForWeChat}
        className="rounded-full border border-rule bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-zinc-50"
      >
        发微信
      </button>
      <button
        type="button"
        title="保存与链接预览相同的封面图，可在朋友圈发「图片」时使用。"
        onClick={saveShareImage}
        className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-accent/15"
      >
        分享图
      </button>
      {!inWeChat && canNativeShare ? (
        <button
          type="button"
          title="使用系统分享面板"
          onClick={nativeShare}
          className="rounded-full border border-rule bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-zinc-50"
        >
          分享
        </button>
      ) : null}
      {toast ? (
        <span className="text-xs font-medium text-accent" role="status">
          {toast}
        </span>
      ) : null}
    </div>
  );
}
