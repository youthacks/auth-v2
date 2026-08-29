import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "#/db";
import { applicationConsents } from "#/db/schema/applications";
import {
  oauthAccessTokens,
  oauthExchangeCodes,
  oauthRefreshTokens,
} from "#/db/schema/oauth";
import { getAssetUrl } from "#/lib/assets";
import { withUser } from "../middleware";

export const getConsents = createServerFn()
  .middleware([withUser])
  .handler(async ({ context }) => {
    const consents = await db.query.applicationConsents.findMany({
      where: { userId: context.withUser.id },
      with: {
        app: { columns: { name: true, homepageUrl: true, logoAssetId: true } },
      },
    });

    return await Promise.all(
      consents.map(async (consent) => ({
        ...consent,
        app: {
          ...consent.app,
          logo: consent.app.logoAssetId
            ? {
                id: consent.app.logoAssetId,
                url: await getAssetUrl(consent.app.logoAssetId),
              }
            : null,
        },
      })),
    );
  });

export const deleteConsent = createServerFn({ method: "POST" })
  .middleware([withUser])
  .validator(z.object({ appId: z.string() }))
  .handler(async ({ data, context }) => {
    const consent = await db.query.applicationConsents.findFirst({
      where: { userId: context.withUser.id, appId: data.appId },
    });
    if (!consent) {
      throw new Error("Consent not found");
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(applicationConsents)
        .where(
          and(
            eq(applicationConsents.appId, data.appId),
            eq(applicationConsents.userId, context.withUser.id),
          ),
        );
      await tx
        .delete(oauthExchangeCodes)
        .where(
          and(
            eq(oauthExchangeCodes.appId, data.appId),
            eq(oauthExchangeCodes.userId, context.withUser.id),
          ),
        );
      await tx
        .delete(oauthAccessTokens)
        .where(
          and(
            eq(oauthAccessTokens.appId, data.appId),
            eq(oauthAccessTokens.userId, context.withUser.id),
          ),
        );
      await tx
        .delete(oauthRefreshTokens)
        .where(
          and(
            eq(oauthRefreshTokens.appId, data.appId),
            eq(oauthRefreshTokens.userId, context.withUser.id),
          ),
        );
    });
  });
