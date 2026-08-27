import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import { eq } from "drizzle-orm";
import z from "zod";
import { requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { applicationOAuthConfig } from "#/db/schema/applications";
import { bouncer } from "#/lib/bouncer";
import { bytesToHex, decrypt, encrypt } from "#/lib/encryption";
import { base } from "#/lib/orpc";
import { createOAuthSchema, updateOAuthSchema } from "./schemas";

export const createOAuth = base
  .meta(openapi({ method: "POST", path: "/apps/{id}/oauth" }))
  .use(requireSession)
  .input(createOAuthSchema.extend({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("apps.update", context);

    // TODO: verify scopes
    const app = await db.query.applications.findFirst({
      where: { id: input.id },
    });
    if (!app) {
      throw new ORPCError("NOT_FOUND");
    }

    const clientSecret = crypto.getRandomValues(new Uint8Array(32));
    const clientSecretEnc = encrypt(clientSecret);

    await db.insert(applicationOAuthConfig).values({
      appId: app.id,
      clientSecretEnc: Buffer.from(clientSecretEnc),
      allowedCallbackUrls: input.allowedCallbackUrls.join("\n"),
    });
  });

export const getOAuth = base
  .meta(openapi({ method: "GET", path: "/apps/{id}/oauth" }))
  .use(requireSession)
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("apps.read", context);

    // TODO: verify scopes
    const app = await db.query.applications.findFirst({
      where: { id: input.id },
      columns: {},
      with: { oauthConfig: true },
    });
    if (!app?.oauthConfig) {
      throw new ORPCError("NOT_FOUND");
    }

    const clientSecret = bytesToHex(decrypt(app.oauthConfig.clientSecretEnc));

    return {
      clientId: app.oauthConfig.appId,
      clientSecret,
      allowedCallbackUrls: app.oauthConfig.allowedCallbackUrls.split("\n"),
    };
  });

export const updateOAuth = base
  .meta(openapi({ method: "PATCH", path: "/apps/{id}/oauth" }))
  .use(requireSession)
  .input(updateOAuthSchema.extend({ id: z.string() }))
  .handler(async ({ context, input }) => {
    bouncer.allow("apps.update", context);

    // TODO: verify scopes
    const app = await db.query.applications.findFirst({
      where: { id: input.id },
      columns: {},
      with: { oauthConfig: true },
    });
    if (!app?.oauthConfig) {
      throw new ORPCError("NOT_FOUND");
    }

    await db
      .update(applicationOAuthConfig)
      .set({
        allowedCallbackUrls: input.allowedCallbackUrls.join("\n"),
      })
      .where(eq(applicationOAuthConfig.appId, app.oauthConfig.appId));
  });
