import { createServerFn } from "@tanstack/react-start";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import z from "zod";
import { requireSession } from "#/actions/auth/session/middleware";
import { db } from "#/db";
import { applicationConsents } from "#/db/schema/applications";
import { oauthExchangeCodes } from "#/db/schema/oauth";
import { getAssetUrl } from "#/lib/assets";
import { oauthAuthorizeSchema } from "./schemas";

export const oauthAuthorizeSilently = createServerFn()
  .middleware([requireSession])
  .validator(oauthAuthorizeSchema)
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

    const existingConsent = await db.query.applicationConsents.findFirst({
      where: { appId: oauthConfig.appId, userId: context.user.id },
    });
    const canSilentlyAuthorize =
      existingConsent &&
      data.scope
        .split(/\s/)
        .every((scope) => existingConsent.scopes.includes(scope));

    if (canSilentlyAuthorize) {
      const code = nanoid(32);
      await db.insert(oauthExchangeCodes).values({
        code,
        scopes: data.scope,
        appId: oauthConfig.appId,
        userId: context.user.id,
        expiresAt: dayjs().add(15, "minutes").toDate(),
      });
      return { code };
    }

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

    const existingConsent = await db.query.applicationConsents.findFirst({
      where: { appId: oauthConfig.appId, userId: context.user.id },
    });

    const code = nanoid(32);
    const newScopes = new Set([
      ...(existingConsent?.scopes.split(/\s/).filter(Boolean) ?? []),
      ...data.scope.split(/\s/).filter(Boolean),
    ]);

    await db.transaction(async (tx) => {
      await tx
        .insert(applicationConsents)
        .values({
          appId: oauthConfig.appId,
          userId: context.user.id,
          scopes: Array.from(newScopes).join(" "),
        })
        .onConflictDoUpdate({
          target: [applicationConsents.appId, applicationConsents.userId],
          set: {
            scopes: Array.from(newScopes).join(" "),
          },
        });
      await tx.insert(oauthExchangeCodes).values({
        code,
        scopes: data.scope,
        appId: oauthConfig.appId,
        userId: context.user.id,
        expiresAt: dayjs().add(15, "minutes").toDate(),
      });
    });

    return { code };
  });

export const oauthGetAppInfo = createServerFn()
  .validator(oauthAuthorizeSchema)
  .handler(async ({ data }) => {
    const app = await db.query.applications.findFirst({
      where: { id: data.client_id },
      with: {
        owner: {
          columns: { firstName: true },
        },
        logo: true,
        background: true,
      },
    });
    if (!app) {
      throw new Error("Invalid client_id");
    }

    const logoPart = app.logo
      ? {
          id: app.logo.id,
          url: await getAssetUrl(app.logo.id),
        }
      : null;
    const backgroundPart = app.background
      ? {
          id: app.background.id,
          url: await getAssetUrl(app.background.id),
        }
      : null;

    return {
      name: app.name,
      logo: logoPart,
      background: backgroundPart,
      owner: {
        firstName: app.owner.firstName,
      },
    };
  });
