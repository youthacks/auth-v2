import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { applicationConsents } from "#/db/schema/applications";
import {
  oauthAccessTokens,
  oauthExchangeCodes,
  oauthRefreshTokens,
} from "#/db/schema/oauth";
import { base } from "#/lib/orpc";

export const getConsents = base
  .meta(openapi({ method: "GET", path: "/users/{id}/consents" }))
  .use(requireSession)
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: { id: input.id },
      columns: {},
      with: {
        appConsents: {
          with: {
            app: { columns: { name: true, homepageUrl: true } },
          },
        },
      },
    });
    if (!user) {
      throw new ORPCError("NOT_FOUND");
    }

    return user.appConsents;
  });

export const getMeConsents = base
  .meta(openapi({ method: "GET", path: "/users/me/consents" }))
  .use(requireSession)
  .handler(async ({ context }) => {
    const consents = await db.query.applicationConsents.findMany({
      where: { userId: context.user.id },
      with: {
        app: { columns: { name: true, homepageUrl: true } },
      },
    });

    return consents;
  });

export const deleteMeConsent = base
  .meta(openapi({ method: "DELETE", path: "/users/me/consents/{appId}" }))
  .use(requireSession)
  .input(z.object({ appId: z.string() }))
  .handler(async ({ input, context }) => {
    const consent = await db.query.applicationConsents.findFirst({
      where: { userId: context.user.id, appId: input.appId },
    });
    if (!consent) {
      throw new ORPCError("NOT_FOUND");
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(applicationConsents)
        .where(
          and(
            eq(applicationConsents.appId, input.appId),
            eq(applicationConsents.userId, context.user.id),
          ),
        );
      await tx
        .delete(oauthExchangeCodes)
        .where(
          and(
            eq(oauthExchangeCodes.appId, input.appId),
            eq(oauthExchangeCodes.userId, context.user.id),
          ),
        );
      await tx
        .delete(oauthAccessTokens)
        .where(
          and(
            eq(oauthAccessTokens.appId, input.appId),
            eq(oauthAccessTokens.userId, context.user.id),
          ),
        );
      await tx
        .delete(oauthRefreshTokens)
        .where(
          and(
            eq(oauthRefreshTokens.appId, input.appId),
            eq(oauthRefreshTokens.userId, context.user.id),
          ),
        );
    });
  });
