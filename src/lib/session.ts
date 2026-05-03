import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  userId?: string;
};

export const sessionOptions = {
  password:
    process.env.SESSION_SECRET ??
    "dev-only-secret-must-be-32-chars-min!!",
  cookieName: "ltmagazine_session",
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 14,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
