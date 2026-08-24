import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import z from "zod";
import { requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { base } from "#/lib/orpc";

export const allUsers = base
  .meta(openapi({ method: "GET", path: "/users" }))
  .use(requireSession)
  .handler(async () => {
    // TODO: verify scopes

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
  .handler(async ({ input }) => {
    // TODO: verify scopes

    const user = await db.query.users.findFirst({
      where: { id: input.id },
    });
    if (!user) {
      throw new ORPCError("NOT_FOUND");
    }

    return user;
  });
