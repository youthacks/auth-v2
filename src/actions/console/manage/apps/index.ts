import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { prisma } from "#/db";
import { genAppId } from "#/lib/id";
import { requireSession } from "#/middleware/requireSession";
import { createAppSchema } from "./schemas";

export const createApp = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(createAppSchema)
  .handler(async ({ data, context }) => {
    const id = genAppId();
    await prisma.app.create({
      data: {
        id,
        name: data.name,
        description: data.description,
        homepageUrl: data.homepageUrl || null,
        ownerId: context.session.userId,
      },
    });

    return { id };
  });

export const getAllApps = createServerFn({ method: "GET" })
  .middleware([requireSession])
  .handler(async () => {
    const apps = await prisma.app.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apps;
  });

export const getAppById = createServerFn({ method: "GET" })
  .middleware([requireSession])
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const app = await prisma.app.findUnique({
      where: { id: data.id },
    });

    if (!app) {
      throw new Error("App not found");
    }

    return app;
  });
