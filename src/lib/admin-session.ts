import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export type AdminSessionData = {
  authenticated?: boolean;
};

export function adminPassword(): string {
  return process.env.ARTICLE_ADMIN_PASSWORD ?? "";
}

export function adminSessionOptions() {
  return {
    cookieName: "ltmagazine_cms",
    password: process.env.SESSION_SECRET ?? "dev-only-secret-must-be-32-chars-min!!",
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function getAdminSession(): Promise<IronSession<AdminSessionData>> {
  return getIronSession<AdminSessionData>(await cookies(), adminSessionOptions());
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!adminPassword()) return false;
  const s = await getAdminSession();
  return Boolean(s.authenticated);
}

