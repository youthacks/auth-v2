import { useSession } from "@tanstack/react-start/server";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { sessions } from "#/db/schema/base";
import defined from "./defined";

const SESSION_SECRET = defined("SESSION_SECRET", process.env.SESSION_SECRET);

interface AppSession {
  sessionId: string;
}

export function useAppSession() {
  return useSession<AppSession>({
    name: "auth-session",
    password: SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      // maxAge: 7 * 24 * 60 * 60,
    },
  });
}

export async function createSession(userId: string) {
  const [{ id }] = await db
    .insert(sessions)
    .values({
      userId,
      expiresAt: dayjs().add(7, "days").toDate(),
    })
    .returning();

  // biome-ignore lint/correctness/useHookAtTopLevel: not a hook
  const appSession = await useAppSession();
  await appSession.update({ sessionId: id });

  return { id };
}

export async function getSession() {
  const NULL_SESSION = { session: null, user: null };

  // biome-ignore lint/correctness/useHookAtTopLevel: not a hook
  const appSession = await useAppSession();
  const id = appSession.data.sessionId;
  if (!id) {
    return NULL_SESSION;
  }

  const session = await db.query.sessions.findFirst({
    where: { id, expiresAt: { gt: new Date() } },
    with: { user: true },
  });
  if (!session) {
    return NULL_SESSION;
  }

  const { user, ...rest } = session;
  return { session: rest, user };
}

export async function logoutSession() {
  // biome-ignore lint/correctness/useHookAtTopLevel: not a hook
  const appSession = await useAppSession();
  const id = appSession.data.sessionId;
  if (!id) {
    return;
  }

  await db.delete(sessions).where(eq(sessions.id, id));

  await appSession.update({ sessionId: undefined });
}
