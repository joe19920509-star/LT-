"use client";

import { useCallback, useMemo, useState } from "react";

type Props = {
  url: string;
  title: string;
  description: string;
};

function isWeChatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

export function ArticleSharePanel({ url, title, description }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const inWeChat = useMemo(() => isWeChatBrowser(), []);
  const canNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const copyForWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash("已复制");
    } catch {
      flash("请长按选中地址栏链接复制");
    }
  }, [url, flash]);

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

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-rule pb-6" aria-label="分享">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">分享</span>
      <button
        type="button"
        onClick={copyForWeChat}
        className="rounded-full border border-rule bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-zinc-50"
      >
        发微信
      </button>
      {!inWeChat && canNativeShare ? (
        <button
          type="button"
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
