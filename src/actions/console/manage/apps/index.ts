import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "#/db";
import { applications } from "#/db/schema/applications";
import { requireSession } from "#/middleware/requireSession";
import { withApplication } from "#/middleware/withApplication";
import { createAppSchema, updateAppSchema } from "./schemas";

export const createApp = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(createAppSchema)
  .handler(async ({ data, context }) => {
    const [{ id }] = await db
      .insert(applications)
      .values({
        name: data.name,
        description: data.description || null,
        homepageUrl: data.homepageUrl,
        ownerId: context.session.userId,
      })
      .returning();

    return { id };
  });

export const getAllApps = createServerFn({ method: "GET" })
  .middleware([requireSession])
  .handler(async () => {
    const apps = await db.query.applications.findMany({
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
    const app = await db.query.applications.findFirst({
      where: { id: data.id },
      with: {
        oauthConfig: {
          columns: { appId: true },
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
    await db
      .update(applications)
      .set({
        name: data.name,
        description: data.description || null,
        homepageUrl: data.homepageUrl,
      })
      .where(eq(applications.id, context.app.id));
  });
