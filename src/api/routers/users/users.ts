import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import { eq } from "drizzle-orm";
import z from "zod";
import { requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { users } from "#/db/schema/base";
import { bouncer } from "#/lib/bouncer";
import { base } from "#/lib/orpc";
import { updateUserSchema } from "./schemas";

export const allUsers = base
  .meta(openapi({ method: "GET", path: "/users" }))
  .use(requireSession)
  .handler(async ({ context }) => {
    bouncer.allow("user.list", context);

    const users = await db.query.users.findMany({
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });
    return users;
  });

export const getUser = base
  .meta(openapi({ method: "GET", path: "/users/{id}" }))
  .use(requireSession)
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("user.read", context, { id: input.id });

    const user = await db.query.users.findFirst({
      where: { id: input.id },
    });
    if (!user) {
      throw new ORPCError("NOT_FOUND");
    }

    return user;
  });

export const updateUser = base
  .meta(openapi({ method: "PATCH", path: "/users/{id}" }))
  .use(requireSession)
  .input(updateUserSchema.extend({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("user.update", context, { id: input.id });

    const user = await db.query.users.findFirst({
      where: { id: input.id },
    });
    if (!user) {
      throw new ORPCError("NOT_FOUND");
    }

    await db
      .update(users)
      .set({
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
      })
      .where(eq(users.id, input.id));
  });
