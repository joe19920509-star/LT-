"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, isSubscriptionActive } from "@/lib/auth";
import { getSession } from "@/lib/session";

/** 演示用：一键开通订阅（生产环境应替换为支付回调） */
export async function activateSubscriptionAction(): Promise<{ error?: string; ok?: boolean }> {
  const session = await getSession();
  if (!session.userId) return { error: "请先登录" };
  const ends = new Date();
  ends.setFullYear(ends.getFullYear() + 1);
  await prisma.user.update({
    where: { id: session.userId },
    data: { isSubscriber: true, subscriptionEndsAt: ends },
  });
  return { ok: true };
}

export async function getSubscriptionStatus() {
  const user = await getCurrentUser();
  if (!user) return { loggedIn: false as const, active: false };
  return {
    loggedIn: true as const,
    active: isSubscriptionActive(user),
    endsAt: user.subscriptionEndsAt,
  };
}
