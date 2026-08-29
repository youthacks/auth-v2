import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "#/db";
import { applications } from "#/db/schema/applications";
import { getAssetUrl } from "#/lib/assets";
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
      with: {
        logo: true,
      },
    });
    return await Promise.all(
      apps.map(async (app) => ({
        ...app,
        logo: app.logo
          ? { id: app.logo.id, url: await getAssetUrl(app.logo.id) }
          : null,
      })),
    );
  });

export const getApp = createServerFn()
  .middleware([withApplication])
  .handler(async ({ context }) => {
    const logoPart = context.app.logoAssetId
      ? {
          id: context.app.logoAssetId,
          url: await getAssetUrl(context.app.logoAssetId),
        }
      : null;
    return { ...context.app, logo: logoPart };
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
        logoAssetId: data.logoAssetId || null,
        backgroundAssetId: data.backgroundAssetId || null,
      })
      .where(eq(applications.id, context.app.id));
  });
