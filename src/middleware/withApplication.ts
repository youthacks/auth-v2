import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { prisma } from "#/db";
import { requireSession } from "./requireSession";

export const withApplication = createMiddleware({ type: "function" })
  .middleware([requireSession])
  .validator(
    z.looseObject({
      id: z.string(),
    }),
  )
  .server(async ({ data, next }) => {
    const app = await prisma.app.findUnique({
      where: { id: data.id },
    });
    if (!app) {
      throw new Error("Application not found");
    }

    return next({
      context: { app },
    });
  });
