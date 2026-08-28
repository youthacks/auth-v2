import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { requireSession } from "#/actions/auth/session/middleware";
import { db } from "#/db";
import { sessions } from "#/db/schema/base";
import { withUser } from "../middleware";

export const getSessions = createServerFn()
  .middleware([withUser])
  .handler(async ({ context }) => {
    const sessions = await db.query.sessions.findMany({
      where: { userId: context.withUser.id },
    });
    return sessions.map((session) => ({
      ...session,
      isCurrent: session.id === context.session.id,
    }));
  });

export const deleteSession = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const session = await db.query.sessions.findFirst({
      where: { id: data.id },
      columns: { id: true, userId: true },
    });
    if (!session || session.userId !== context.user.id) {
      throw new Error("Session not found");
    }

    if (session.id === context.session?.id) {
      throw new Error("Cannot delete current session");
    }

    await db.delete(sessions).where(eq(sessions.id, session.id));
  });
