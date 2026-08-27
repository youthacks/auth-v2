import { openapi } from "@orpc/openapi";
import { eq } from "drizzle-orm";
import { maybeSession, requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { users } from "#/db/schema/base";
import { bouncer } from "#/lib/bouncer";
import { base } from "#/lib/orpc";
import { updateMeSchema } from "./schemas";

export const getMe = base
  .meta(openapi({ method: "GET", path: "/users/me" }))
  .use(maybeSession)
  .handler(async ({ context }) => {
    const { user } = context;
    if (!user) return null;

    bouncer.allow("user.read", context, user);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      updatedAt: user.updatedAt,
    };
  });

export const updateMe = base
  .meta(openapi({ method: "PATCH", path: "/users/me" }))
  .use(requireSession)
  .input(updateMeSchema)
  .handler(async ({ context, input }) => {
    bouncer.allow("user.update", context, context.user);

    await db
      .update(users)
      .set({
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
      })
      .where(eq(users.id, context.user.id));
  });
