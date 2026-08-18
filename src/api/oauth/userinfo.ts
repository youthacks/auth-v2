import { timingSafeEqual } from "node:crypto";
import { openapi } from "@orpc/openapi";
import { ORPCError } from "@orpc/server";
import { db } from "#/db";
import { base } from "#/lib/orpc";
import sha256 from "#/lib/sha256";

export const userinfo = base
  .meta(openapi({ method: "GET", path: "/userinfo" }))
  .handler(async ({ context }) => {
    const Authorization = context.reqHeaders?.get("Authorization");
    const [method, token] = (Authorization || "").split(/\s/);
    if (method !== "Bearer" || !token) {
      throw new ORPCError("UNAUTHORIZED", {
        // TODO: more informative error message
        message: "No bearer token provided",
      });
    }

    const [, id, secret, _extra] = token.split(".");
    if (!id || !secret || _extra) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Invalid access token provided",
      });
    }

    const accessToken = await db.query.oauthAccessTokens.findFirst({
      where: { id },
    });

    const isSecretEqual = timingSafeEqual(
      accessToken?.secretHash || Buffer.from(""),
      await sha256(secret),
    );
    if (!accessToken || !isSecretEqual) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Invalid access token provided",
      });
    }

    // TODO: verify scopes
    const user = await db.query.users.findFirst({
      where: { id: accessToken.userId },
    });
    if (!user) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
    return {
      sub: user.id,
      name: `${user.firstName} ${user.lastName}`,
      given_name: user.firstName,
      family_name: user.lastName,
      nickname: user.firstName,
      updated_at: user.updatedAt,

      email: user.email,
      email_verified: true,
      birthdate: user.dateOfBirth,
    };
  });
