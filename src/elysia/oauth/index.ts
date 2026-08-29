import { timingSafeEqual } from "node:crypto";
import { cors } from "@elysia/cors";
import { hexToBytes } from "@noble/ciphers/utils.js";
import { eq } from "drizzle-orm";
import { Elysia, status, t } from "elysia";
import { db } from "#/db";
import { oauthExchangeCodes } from "#/db/schema/oauth";
import { getAssetUrl } from "#/lib/assets";
import { decrypt } from "#/lib/encryption";
import { createTokenPair, refreshTokenPair } from "#/lib/tokens";
import { base } from "../base";

export const oauthApi = new Elysia({ prefix: "/oauth" })
  .use(base)
  .use(cors())
  .post(
    "/token",
    async ({ body }) => {
      switch (body.grant_type) {
        case "authorization_code": {
          const exchangeCode = await db.query.oauthExchangeCodes.findFirst({
            where: { code: body.code },
            with: {
              app: {
                columns: {},
                with: { oauthConfig: { columns: { clientSecretEnc: true } } },
              },
            },
          });
          await db
            .delete(oauthExchangeCodes)
            .where(eq(oauthExchangeCodes.code, body.code));

          // biome-ignore lint/complexity/useOptionalChain: more explicit
          if (!exchangeCode || !exchangeCode.app.oauthConfig) {
            return status(400, "Invalid or expired exchange code");
          }

          // TODO: verify redirect_uri matches the one used to generate the exchange code
          try {
            const clientIdMatch = timingSafeEqual(
              Buffer.from(body.client_id),
              Buffer.from(exchangeCode.appId),
            );
            const clientSecretMatch = timingSafeEqual(
              hexToBytes(body.client_secret),
              decrypt(exchangeCode.app.oauthConfig.clientSecretEnc),
            );
            if (!clientIdMatch || !clientSecretMatch) {
              return status(400, "Client id or client secret does not match");
            }
          } catch (_e) {
            // likely an invalid client secret provided to hexToBytes
            return status(400, "Client id or client secret does not match");
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
            clientId: body.client_id,
            clientSecret: body.client_secret,
            refreshToken: body.refresh_token,
          });
          if (!tokens) {
            return status(
              400,
              "Invalid or expired refresh token, or incorrect client id or secret",
            );
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
    },
    {
      body: t.Union([
        t.Object({
          grant_type: t.Literal("authorization_code"),
          client_id: t.String(),
          client_secret: t.String(),
          redirect_uri: t.String(),
          code: t.String(),
        }),
        t.Object({
          grant_type: t.Literal("refresh_token"),
          client_id: t.String(),
          client_secret: t.String(),
          refresh_token: t.String(),
        }),
      ]),
    },
  )
  .get(
    "/userinfo",
    async ({ user, accessToken }) => {
      const tokenScopes = accessToken.scopes.split(" ");

      const avatar = await db.query.userAvatars.findFirst({
        where: { userId: user.id },
        with: {
          asset: true,
        },
      });

      const profilePart = {
        name: user.isLastNameFirst
          ? `${user.lastName} ${user.firstName}`
          : `${user.firstName} ${user.lastName}`,
        given_name: user.firstName,
        family_name: user.lastName,
        nickname: user.firstName,
        picture: avatar ? await getAssetUrl(avatar.asset.id) : null,
        updated_at: user.updatedAt,
      };
      const emailPart = {
        email: user.email,
        email_verified: true,
      };
      const birthdatePart = {
        birthdate: user.dateOfBirth,
      };

      return {
        sub: user.id,

        ...(tokenScopes.includes("profile") ? profilePart : {}),
        ...(tokenScopes.includes("email") ? emailPart : {}),
        ...(tokenScopes.includes("birthdate") ? birthdatePart : {}),
      };
    },
    {
      auth: true,
      // TODO: include openid scope here once a separate /users/me endpoint is created
      scopes: ["profile", "email", "birthdate"],
    },
  );
