import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import { eq } from "drizzle-orm";
import { UAParser } from "ua-parser-js";
import z from "zod";
import { requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { sessions } from "#/db/schema/base";
import { bouncer } from "#/lib/bouncer";
import { base } from "#/lib/orpc";

export const getSessions = base
  .meta(openapi({ method: "GET", path: "/users/{id}/consents" }))
  .use(requireSession)
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("session.list", context, { userId: input.id });

    // TODO: verify scopes
    const user = await db.query.users.findFirst({
      where: { id: input.id },
      columns: {},
      with: {
        sessions: true,
      },
    });
    if (!user) {
      throw new ORPCError("NOT_FOUND");
    }

    return user.sessions;
  });

export const getMeSessions = base
  .meta(openapi({ method: "GET", path: "/users/me/sessions" }))
  .use(requireSession)
  .handler(async ({ context }) => {
    bouncer.allow("session.list", context, { userId: context.user.id });

    const sessions = await db.query.sessions.findMany({
      where: { userId: context.user.id },
      orderBy: { createdAt: "desc" },
    });

    return sessions.map((session) => ({
      ...session,
      isCurrent: context.session ? session.id === context.session.id : false,
    }));
  });

export const deleteSession = base
  .meta(openapi({ method: "DELETE", path: "/users/sessions/{sessionId}" }))
  .use(requireSession)
  .input(z.object({ sessionId: z.string() }))
  .handler(async ({ input, context }) => {
    const session = await db.query.sessions.findFirst({
      where: { id: input.sessionId, userId: context.user.id },
      columns: { id: true, userId: true },
    });
    if (!session) {
      throw new ORPCError("NOT_FOUND");
    }

    bouncer.allow("session.delete", context, session);

    if (session.id === context.session?.id) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Cannot delete current session",
      });
    }

    await db.delete(sessions).where(eq(sessions.id, session.id));
  });
