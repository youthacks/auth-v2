import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { db } from "#/db";
import { requireSession } from "../auth/session/middleware";

export const withUser = createMiddleware({ type: "function" })
  .middleware([requireSession])
  .validator(
    z.looseObject({
      id: z.string(),
    }),
  )
  .server(async ({ context, data, next }) => {
    if (data.id === "me") {
      return next({
        context: { withUser: context.user },
      });
    }

    if (context.user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const withUser = await db.query.users.findFirst({
      where: { id: data.id },
    });
    if (!withUser) {
      throw new Error("User not found");
    }

    return next({
      context: { withUser },
    });
  });
