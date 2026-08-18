import { createServerFn } from "@tanstack/react-start";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import z from "zod";
import { db } from "#/db";
import { oauthExchangeCodes } from "#/db/schema/oauth";
import { requireSession } from "#/middleware/requireSession";
import { oauthAuthorizeSchema } from "./schemas";

export const oauthAuthorizeSilently = createServerFn()
  .middleware([requireSession])
  .validator(oauthAuthorizeSchema)
  .handler(async ({ data, context }) => {
    return null;
  });

export const oauthAuthorize = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(
    oauthAuthorizeSchema.extend({
      consent: z.literal(true),
    }),
  )
  .handler(async ({ data, context }) => {
    const oauthConfig = await db.query.applicationOAuthConfig.findFirst({
      where: { appId: data.client_id },
    });
    if (!oauthConfig) {
      throw new Error("Invalid client_id");
    }

    const allowedRedirectUris = new Set(
      oauthConfig.allowedCallbackUrls.split("\n"),
    );
    if (!allowedRedirectUris.has(data.redirect_uri)) {
      throw new Error("Invalid redirect_uri");
    }

    const code = nanoid(32);

    await db.insert(oauthExchangeCodes).values({
      code,
      scopes: data.scope,
      appId: oauthConfig.appId,
      userId: context.user.id,
      expiresAt: dayjs().add(15, "minutes").toDate(),
    });

    return { code };
  });

export const oauthGetAppInfo = createServerFn()
  .middleware([requireSession])
  .validator(oauthAuthorizeSchema)
  .handler(async ({ data }) => {
    const app = await db.query.applications.findFirst({
      where: { id: data.client_id },
      with: {
        owner: {
          columns: { firstName: true },
        },
      },
    });
    if (!app) {
      throw new Error("Invalid client_id");
    }

    return {
      name: app.name,
      owner: {
        firstName: app.owner.firstName,
      },
    };
  });
