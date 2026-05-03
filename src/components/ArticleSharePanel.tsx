"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  /** 服务端生成的文章链接二维码（桌面悬停「发微信」用） */
  qrDataUrl: string;
};

function isWeChatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

/** 触屏或小屏：点击「发微信」出卡片；桌面细指针：悬停出二维码、点击复制 */
function useMobileShareUi(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const run = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.innerWidth < 768;
      setMobile(coarse || narrow);
    };
    run();
    const mq = window.matchMedia("(pointer: coarse)");
    mq.addEventListener("change", run);
    window.addEventListener("resize", run);
    return () => {
      mq.removeEventListener("change", run);
      window.removeEventListener("resize", run);
    };
  }, []);
  return mobile;
}

export function ArticleSharePanel({ url, title, description, imageUrl, slug, qrDataUrl }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileUi = useMobileShareUi();
  const inWeChat = useMemo(() => isWeChatBrowser(), []);
  const canNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!cardOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCardOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [cardOpen]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const copyForWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash(inWeChat ? "已复制。若对方只见网址，请其点开链接，或用「分享图」发图片。" : "已复制");
    } catch {
      flash("请长按选中地址栏链接复制");
    }
  }, [url, flash, inWeChat]);

  const onWeChatButtonClick = useCallback(() => {
    if (mobileUi) {
      setCardOpen(true);
      return;
    }
    void copyForWeChat();
  }, [mobileUi, copyForWeChat]);

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

  const cardModal =
    mounted && cardOpen && mobileUi
      ? createPortal(
          <div
            className="fixed inset-0 z-[300] flex items-end justify-center bg-black/45 p-3 sm:p-6 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label="分享预览"
            onClick={() => setCardOpen(false)}
          >
            <div
              className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-xl border border-rule bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[1200/630] w-full bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="h-full w-full object-cover object-left" />
              </div>
              <div className="border-t border-rule p-4">
                <h2 className="font-display text-lg font-bold leading-snug text-ink">{title}</h2>
                {description ? (
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{description}</p>
                ) : null}
                <p className="mt-3 break-all font-mono text-[11px] leading-snug text-muted">{url}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90"
                    onClick={async () => {
                      await copyForWeChat();
                      setCardOpen(false);
                    }}
                  >
                    复制链接
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-rule bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-zinc-50"
                    onClick={() => setCardOpen(false)}
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2" aria-label="分享操作">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">分享</span>

        <div className={`relative inline-block ${!mobileUi ? "group" : ""}`}>
          <button
            type="button"
            title={
              mobileUi
                ? "查看分享卡片并复制链接"
                : "悬停显示二维码；点击复制链接。聊天里若只显示成一串网址，请对方点击打开。"
            }
            onClick={onWeChatButtonClick}
            className="rounded-full border border-rule bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-zinc-50"
          >
            发微信
          </button>
          {!mobileUi ? (
            <div
              role="tooltip"
              className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-2 w-[220px] -translate-x-1/2 rounded-lg border border-rule bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100"
            >
              <p className="mb-2 text-center text-[10px] font-medium text-muted">微信扫一扫打开</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} width={196} height={196} alt="" className="mx-auto block h-[196px] w-[196px]" />
            </div>
          ) : null}
        </div>

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
      {cardModal}
    </>
  );
}
