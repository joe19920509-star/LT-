import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      phone: true,
      age: true,
      gender: true,
      region: true,
      occupation: true,
      isSubscriber: true,
      subscriptionEndsAt: true,
      createdAt: true,
    },
  });
  return user;
}

export function isSubscriptionActive(user: {
  isSubscriber: boolean;
  subscriptionEndsAt: Date | null;
}) {
  if (!user.isSubscriber) return false;
  if (!user.subscriptionEndsAt) return true;
  return user.subscriptionEndsAt > new Date();
}
