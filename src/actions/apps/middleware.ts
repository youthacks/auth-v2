import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { db } from "#/db";
import { requireSession } from "../auth/session/middleware";

export const withApplication = createMiddleware({ type: "function" })
  .middleware([requireSession])
  .validator(
    z.looseObject({
      id: z.string(),
    }),
  )
  .server(async ({ context, data, next }) => {
    if (context.user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const app = await db.query.applications.findFirst({
      where: { id: data.id },
      with: {
        oauthConfig: { columns: { appId: true } },
      },
    });
    if (!app) {
      throw new Error("Application not found");
    }

    return next({
      context: { app },
    });
  });
