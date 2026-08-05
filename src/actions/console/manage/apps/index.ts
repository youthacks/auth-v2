import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { prisma } from "#/db";
import { genAppId } from "#/lib/id";
import { requireSession } from "#/middleware/requireSession";
import { withApplication } from "#/middleware/withApplication";
import { createAppSchema, updateAppSchema } from "./schemas";

export const createApp = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(createAppSchema)
  .handler(async ({ data, context }) => {
    const id = genAppId();
    await prisma.app.create({
      data: {
        id,
        name: data.name,
        description: data.description || null,
        homepageUrl: data.homepageUrl,
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
      include: {
        oauth2Config: {
          select: { appId: true },
        },
      },
    });

    if (!app) {
      throw new Error("App not found");
    }

    return app;
  });

export const updateApp = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(updateAppSchema)
  .handler(async ({ data, context }) => {
    await prisma.app.update({
      where: { id: context.app.id },
      data: {
        name: data.name,
        description: data.description || null,
        homepageUrl: data.homepageUrl,
      },
    });
  });
