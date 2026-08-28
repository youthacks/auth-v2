import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { applications } from "#/db/schema/applications";
import { requireSession } from "../auth/session/middleware";
import { withApplication } from "./middleware";
import { appSchema } from "./schemas";

export const createApp = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(appSchema)
  .handler(async ({ data, context }) => {
    if (context.user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const [{ id }] = await db
      .insert(applications)
      .values({
        name: data.name,
        description: data.description || null,
        homepageUrl: data.homepageUrl,
        ownerId: context.user.id,
      })
      .returning();

    return { id };
  });

export const listApps = createServerFn()
  .middleware([requireSession])
  .handler(async ({ context }) => {
    if (context.user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const apps = await db.query.applications.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apps;
  });

export const getApp = createServerFn()
  .middleware([withApplication])
  .handler(async ({ context }) => {
    return context.app;
  });

export const updateApp = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(appSchema)
  .handler(async ({ context, data }) => {
    await db
      .update(applications)
      .set({
        name: data.name,
        description: data.description || null,
        homepageUrl: data.homepageUrl,
      })
      .where(eq(applications.id, context.app.id));
  });
