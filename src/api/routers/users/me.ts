import { openapi } from "@orpc/openapi";
import { maybeSession, requireSession } from "#/api/middleware/requireSession";
import { base } from "#/lib/orpc";
import { updateMeSchema } from "./schemas";
import { db } from "#/db";
import { users } from "#/db/schema/base";
import { eq } from "drizzle-orm";

export const getMe = base
  .meta(openapi({ method: "GET", path: "/users/me" }))
  .use(maybeSession)
  .handler(async ({ context }) => {
    // TODO: verify scopes
    const { user } = context;
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      updatedAt: user.updatedAt,
    };
  });

export const updateMe = base
  .meta(openapi({ method: "PATCH", path: "/users/me" }))
  .use(requireSession)
  .input(updateMeSchema)
  .handler(async ({ context, input }) => {
    // TODO: verify scopes

    await db
      .update(users)
      .set({
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
      })
      .where(eq(users.id, context.user.id));
  });
