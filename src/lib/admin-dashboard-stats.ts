import type { Gender } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isSubscriptionActive } from "@/lib/auth";

export type BreakdownRow = { label: string; count: number };

export type AdminUserDashboard = {
  usersTotal: number;
  subscribersActive: number;
  byGender: BreakdownRow[];
  byRegion: BreakdownRow[];
  byOccupation: BreakdownRow[];
};

const genderLabel: Record<Gender, string> = {
  male: "男",
  female: "女",
  other: "其他",
  prefer_not: "不愿透露",
};

const genderOrder: Gender[] = ["male", "female", "other", "prefer_not"];

export async function getAdminUserDashboard(): Promise<AdminUserDashboard> {
  const usersTotal = await prisma.user.count();

  const usersForSub = await prisma.user.findMany({
    select: { isSubscriber: true, subscriptionEndsAt: true },
  });
  const subscribersActive = usersForSub.filter((u) =>
    isSubscriptionActive({
      isSubscriber: u.isSubscriber,
      subscriptionEndsAt: u.subscriptionEndsAt,
    }),
  ).length;

  if (usersTotal === 0) {
    return {
      usersTotal: 0,
      subscribersActive: 0,
      byGender: [],
      byRegion: [],
      byOccupation: [],
    };
  }

  const [genderGroups, regionGroups, occGroups] = await Promise.all([
    prisma.user.groupBy({
      by: ["gender"],
      _count: { id: true },
    }),
    prisma.user.groupBy({
      by: ["region"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 50,
    }),
    prisma.user.groupBy({
      by: ["occupation"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 50,
    }),
  ]);

  const genderMap = new Map(genderGroups.map((g) => [g.gender, g._count.id]));
  const byGender: BreakdownRow[] = genderOrder
    .map((g) => ({
      label: genderLabel[g],
      count: genderMap.get(g) ?? 0,
    }))
    .filter((row) => row.count > 0);

  const byRegion: BreakdownRow[] = regionGroups.map((r) => ({
    label: (r.region || "").trim() || "（未填）",
    count: r._count.id,
  }));

  const byOccupation: BreakdownRow[] = occGroups.map((o) => ({
    label: (o.occupation || "").trim() || "（未填）",
    count: o._count.id,
  }));

  return { usersTotal, subscribersActive, byGender, byRegion, byOccupation };
}
