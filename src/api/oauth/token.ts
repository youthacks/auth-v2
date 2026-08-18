import { openapi } from "@orpc/openapi";
import { ORPCError } from "@orpc/server";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import z from "zod";
import { db } from "#/db";
import {
  oauthAccessTokens,
  oauthExchangeCodes,
  oauthRefreshTokens,
} from "#/db/schema/oauth";
import { base } from "#/lib/orpc";
import sha256 from "#/lib/sha256";

export const token = base
  .meta(openapi({ method: "POST", path: "/token" }))
  .input(
    z.discriminatedUnion("grant_type", [
      z.object({
        grant_type: z.literal("authorization_code"),
        client_id: z.string(),
        client_secret: z.string(),
        redirect_uri: z.url(),
        code: z.string(),
      }),
      z.object({
        grant_type: z.literal("refresh_token"),
        client_id: z.string(),
        client_secret: z.string(),
        refresh_token: z.string(),
      }),
    ]),
  )
  .handler(async ({ input }) => {
    switch (input.grant_type) {
      case "authorization_code": {
        const exchangeCode = await db.query.oauthExchangeCodes.findFirst({
          where: { code: input.code },
        });
        await db
          .delete(oauthExchangeCodes)
          .where(eq(oauthExchangeCodes.code, input.code));

        if (!exchangeCode) {
          throw new ORPCError("UNAUTHORIZED", {
            message: "Invalid code",
          });
        }

        const accessTokenId = nanoid(16);
        const accessTokenSecret = nanoid(16);
        const accessTokenSecretHash = await sha256(accessTokenSecret);

        const refreshTokenId = nanoid(16);
        const refreshTokenSecret = nanoid(16);
        const refreshTokenSecretHash = await sha256(refreshTokenSecret);

        await db.transaction(async (tx) => {
          await tx.insert(oauthAccessTokens).values({
            id: accessTokenId,
            secretHash: Buffer.from(accessTokenSecretHash),
            scopes: exchangeCode.scopes,

            appId: exchangeCode.appId,
            userId: exchangeCode.userId,

            expiresAt: dayjs().add(1, "hour").toDate(),
          });
          await tx.insert(oauthRefreshTokens).values({
            id: refreshTokenId,
            secretHash: Buffer.from(refreshTokenSecretHash),
            scopes: exchangeCode.scopes,

            appId: exchangeCode.appId,
            userId: exchangeCode.userId,

            authTime: exchangeCode.createdAt,
            expiresAt: dayjs().add(30, "days").toDate(),
          });
        });

        const accessToken = `ythtk.${accessTokenId}.${accessTokenSecret}`;
        const refreshToken = `ythrf.${refreshTokenId}.${refreshTokenSecret}`;

        return {
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: 60 * 60, // 1 hour
          refresh_token: refreshToken,
          scope: exchangeCode.scopes,
        };
      }
      case "refresh_token": {
        throw new ORPCError("NOT_IMPLEMENTED");
      }
    }
  });
