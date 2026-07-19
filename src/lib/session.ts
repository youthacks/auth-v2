import { useSession } from "@tanstack/react-start/server";
import dayjs from "dayjs";
import { prisma } from "#/db";
import defined from "./defined";
import { genSessionId } from "./id";

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
  const id = genSessionId();
  await prisma.session.create({
    data: {
      id,
      userId,
      expiresAt: dayjs().add(7, "day").toDate(),
    },
  });

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

  const session = await prisma.session.findUnique({
    where: { id, expiresAt: { gt: new Date() } },
    include: { user: true },
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

  await prisma.session.delete({
    where: { id },
  });

  await appSession.update({ sessionId: undefined });
}
