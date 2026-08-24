import { timingSafeEqual } from "node:crypto";
import { hexToBytes } from "@noble/ciphers/utils.js";
import { openapi } from "@orpc/openapi";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "#/db";
import { oauthExchangeCodes } from "#/db/schema/oauth";
import { decrypt } from "#/lib/encryption";
import { base } from "#/lib/orpc";
import { createTokenPair, refreshTokenPair } from "#/lib/tokens";

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
          with: {
            app: {
              columns: {},
              with: { oauthConfig: { columns: { clientSecretEnc: true } } },
            },
          },
        });
        await db
          .delete(oauthExchangeCodes)
          .where(eq(oauthExchangeCodes.code, input.code));

        // biome-ignore lint/complexity/useOptionalChain: more explicit
        if (!exchangeCode || !exchangeCode.app.oauthConfig) {
          throw new ORPCError("UNAUTHORIZED", {
            message: "Invalid code",
          });
        }

        try {
          const clientIdMatch = timingSafeEqual(
            Buffer.from(input.client_id),
            Buffer.from(exchangeCode.appId),
          );
          const clientSecretMatch = timingSafeEqual(
            hexToBytes(input.client_secret),
            decrypt(exchangeCode.app.oauthConfig.clientSecretEnc),
          );
          if (!clientIdMatch || !clientSecretMatch) {
            throw new ORPCError("UNAUTHORIZED", {
              message: "Client id or client secret does not match",
            });
          }
        } catch (_e) {
          // likely an invalid client secret provided to hexToBytes
          throw new ORPCError("UNAUTHORIZED", {
            message: "Client id or client secret does not match",
          });
        }

        const tokens = await createTokenPair({
          ...exchangeCode,
          authTime: exchangeCode.createdAt,
        });
        const { accessToken, expiresIn, refreshToken, scopes } = tokens;

        return {
          token_type: "Bearer",
          access_token: accessToken,
          expires_in: expiresIn,
          refresh_token: refreshToken,
          scope: scopes,
        };
      }
      case "refresh_token": {
        const tokens = await refreshTokenPair({
          clientId: input.client_id,
          clientSecret: input.client_secret,
          refreshToken: input.refresh_token,
        });
        if (!tokens) {
          throw new ORPCError("UNAUTHORIZED", {
            message:
              "Invalid or expired refresh token, or incorrect client id or secret",
          });
        }

        const { accessToken, expiresIn, refreshToken, scopes } = tokens;
        return {
          token_type: "Bearer",
          access_token: accessToken,
          expires_in: expiresIn,
          refresh_token: refreshToken,
          scope: scopes,
        };
      }
    }
  });
