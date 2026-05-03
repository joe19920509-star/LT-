import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isSubscriptionActive } from "@/lib/auth";
import { SubscribeButton } from "./SubscribeButton";

export const metadata: Metadata = {
  title: "订阅",
  description: "开通 LT Magazine 订阅，解锁全文与个性化今日看版。",
};

export default async function SubscribePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/subscribe");

  const active = isSubscriptionActive(user);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-bold">订阅 LT Magazine</h1>
      <p className="mt-3 text-muted">
        订阅后可阅读全部付费文章，并在账户页查看根据您的地区、职业等信息生成的「今日看版」。
      </p>

      {active ? (
        <div className="mt-8 rounded border border-rule bg-white p-6">
          <p className="font-medium text-ink">您已是订阅会员。</p>
          {user.subscriptionEndsAt && (
            <p className="mt-2 text-sm text-muted">
              当前周期至 {user.subscriptionEndsAt.toLocaleDateString("zh-CN")}
            </p>
          )}
          <Link
            href="/account"
            className="mt-4 inline-block text-sm font-semibold text-accent underline underline-offset-4"
          >
            前往账户与今日看版 →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6 rounded border border-rule bg-white p-6">
          <ul className="list-inside list-disc space-y-2 text-sm text-muted">
            <li>全文阅读：市场、信用、亚太、大宗等栏目</li>
            <li>个性化「今日看版」：按画像排序重点报道</li>
            <li>演示环境：点击下方按钮模拟支付成功（一年期）</li>
          </ul>
          <SubscribeButton />
          <p className="text-xs text-muted">
            正式部署至 ltmagazine.cn 时，请替换为微信/支付宝/Stripe 等支付回调，在回调中写入{" "}
            <code className="rounded bg-paper px-1">isSubscriber</code> 与到期时间。
          </p>
        </div>
      )}
    </div>
  );
}
