import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import { eq } from "drizzle-orm";
import z from "zod";
import { requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { applications } from "#/db/schema/applications";
import { bouncer } from "#/lib/bouncer";
import { base } from "#/lib/orpc";
import { createAppSchema, updateAppSchema } from "./schemas";

export const createApp = base
  .meta(openapi({ method: "POST", path: "/apps" }))
  .use(requireSession)
  .input(createAppSchema)
  .handler(async ({ input, context }) => {
    bouncer.allow("apps.create", context);

    // TODO: verify scopes
    const [{ id }] = await db
      .insert(applications)
      .values({
        name: input.name,
        description: input.description || null,
        homepageUrl: input.homepageUrl,
        ownerId: context.user.id,
      })
      .returning();

    return { id };
  });

export const allApps = base
  .meta(openapi({ method: "GET", path: "/apps" }))
  .use(requireSession)
  .handler(async ({ context }) => {
    bouncer.allow("apps.list", context);

    const apps = await db.query.applications.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apps;
  });

export const getApp = base
  .meta(openapi({ method: "GET", path: "/apps/{id}" }))
  .use(requireSession)
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("apps.read", context);

    // TODO: verify scopes
    const app = await db.query.applications.findFirst({
      where: { id: input.id },
      with: {
        oauthConfig: {
          columns: { appId: true },
        },
      },
    });

    if (!app) {
      throw new ORPCError("NOT_FOUND");
    }

    return app;
  });

export const updateApp = base
  .meta(openapi({ method: "PATCH", path: "/apps/{id}" }))
  .use(requireSession)
  .input(updateAppSchema.extend({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("apps.update", context);

    // TODO: verify scopes
    const app = await db.query.applications.findFirst({
      where: { id: input.id },
    });
    if (!app) {
      throw new ORPCError("NOT_FOUND");
    }

    await db
      .update(applications)
      .set({
        name: input.name,
        description: input.description || null,
        homepageUrl: input.homepageUrl,
      })
      .where(eq(applications.id, app.id));
  });
