"use client";

import { useCallback, useMemo, useState } from "react";

type Props = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
};

function isWeChatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

export function ArticleSharePanel({ url, title, description, imageUrl }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const inWeChat = useMemo(() => isWeChatBrowser(), []);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    window.setTimeout(() => setFeedback(null), 4500);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      showFeedback("链接已复制。到微信里粘贴发送即可；好友看到的卡片会带标题和封面图。");
    } catch {
      showFeedback("无法自动复制，请手动选中下方链接复制。");
    }
  }, [url, showFeedback]);

  const trySystemShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({
        title,
        text: description || title,
        url,
      });
    } catch (e) {
      const err = e as { name?: string };
      if (err?.name === "AbortError") return;
      await copyLink();
    }
  }, [title, description, url, copyLink]);

  return (
    <section
      className="mt-8 rounded border border-rule bg-gradient-to-b from-zinc-50/90 to-white p-4 md:p-5"
      aria-label="分享本文"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">分享</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        微信、朋友圈的分享卡片使用<strong className="text-ink">链接预览</strong>（标题 + 缩略图）。请把本页链接发给好友或按下方说明从微信内分享。
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="rounded bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-ink/90"
        >
          复制文章链接
        </button>
        {!inWeChat && (
          <button
            type="button"
            onClick={trySystemShare}
            className="rounded border border-rule bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-zinc-50"
          >
            系统分享…
          </button>
        )}
      </div>

      {inWeChat ? (
        <div className="mt-4 rounded border border-accent/25 bg-accent/5 px-3 py-3 text-sm leading-relaxed text-ink">
          <p className="font-semibold text-ink">在微信里发朋友圈 / 好友</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-ink/90">
            <li>点击右上角「<strong>···</strong>」菜单。</li>
            <li>选「<strong>发送给朋友</strong>」或「<strong>分享到朋友圈</strong>」。</li>
            <li>对方看到的卡片会显示<strong>文章标题</strong>与<strong>封面缩略图</strong>（与下方预览一致）。</li>
          </ol>
          <p className="mt-2 text-xs text-muted">
            说明：网页不能像 App 一样直接调起「分享」面板；这是微信机制。若需在按钮上一键设置摘要图，需另行配置微信公众号 JSSDK 与域名白名单。
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex gap-3 border-t border-rule pt-4">
        <div className="relative h-[72px] w-[120px] shrink-0 overflow-hidden rounded border border-rule bg-zinc-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- 动态 OG 外链，非 next/image 静态资源 */}
          <img src={imageUrl} alt="" className="h-full w-full object-cover object-left" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-display text-sm font-bold leading-snug text-ink">{title}</p>
          {description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{description}</p>
          ) : null}
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted/80">分享预览</p>
        </div>
      </div>

      {feedback ? <p className="mt-3 text-sm font-medium text-accent">{feedback}</p> : null}

      <p className="mt-3 break-all font-mono text-[11px] leading-snug text-muted">
        <span className="font-sans font-semibold text-ink/70">链接</span> {url}
      </p>
    </section>
  );
}
