import { timingSafeEqual } from "node:crypto";
import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "#/db";
import { oauthAccessTokens, oauthRefreshTokens } from "#/db/schema/oauth";
import { decrypt, hexToBytes } from "./encryption";
import sha256 from "./sha256";

export async function createTokenPair(data: {
  appId: string;
  userId: string;
  sessionId?: string | null;
  scopes: string;
  authTime: Date;
}) {
  const accessTokenId = nanoid(16);
  const accessTokenSecret = nanoid(16);
  const accessTokenSecretHash = await sha256(accessTokenSecret);

  const refreshTokenId = nanoid(16);
  const refreshTokenSecret = nanoid(16);
  const refreshTokenSecretHash = await sha256(refreshTokenSecret);

  await db.transaction(async (tx) => {
    await tx.insert(oauthRefreshTokens).values({
      id: refreshTokenId,
      secretHash: Buffer.from(refreshTokenSecretHash),
      scopes: data.scopes,

      appId: data.appId,
      userId: data.userId,

      authTime: data.authTime,
      expiresAt: dayjs().add(30, "days").toDate(),
    });
    await tx.insert(oauthAccessTokens).values({
      id: accessTokenId,
      secretHash: Buffer.from(accessTokenSecretHash),
      scopes: data.scopes,

      appId: data.appId,
      userId: data.userId,
      sessionId: data.sessionId,
      refreshTokenId,

      expiresAt: dayjs().add(1, "hour").toDate(),
    });
  });

  const accessToken = `ythtk.${accessTokenId}.${accessTokenSecret}`;
  const refreshToken = `ythrf.${refreshTokenId}.${refreshTokenSecret}`;

  return {
    accessToken,
    refreshToken,
    // expiresIn: 60 * 60, // 1 hour
    expiresIn: 30,
    scopes: data.scopes,
  };
}

export async function getAccessToken(
  mode: "header" | "token",
  token: string | null | undefined,
) {
  const NULL_SESSION = { user: null, session: null, accessToken: null };
  if (!token) return NULL_SESSION;

  if (mode === "header") {
    const [method, value, _extra] = token.split(/\s/);
    if (method !== "Bearer" || !value || _extra) return NULL_SESSION;

    token = value;
  }

  const [leading, id, secret, _extra] = token.split(".");
  if (leading !== "ythtk" || !id || !secret || _extra) return NULL_SESSION;

  const accessToken = await db.query.oauthAccessTokens.findFirst({
    where: { id, expiresAt: { gt: new Date() } },
    with: {
      session: true,
      user: true,
    },
  });

  const isSecretEqual = timingSafeEqual(
    accessToken?.secretHash || Buffer.from(""),
    await sha256(secret),
  );
  if (!accessToken || !isSecretEqual) return NULL_SESSION;

  const { user, session, ...rest } = accessToken;

  return { user, session, accessToken: rest };
}

export async function refreshTokenPair(data: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}) {
  const [leading, id, secret, _extra] = data.refreshToken.split(".");
  if (leading !== "ythrf" || !id || !secret || _extra) return null;

  const refreshToken = await db.query.oauthRefreshTokens.findFirst({
    where: { id, expiresAt: { gt: new Date() } },
    with: {
      app: {
        columns: {},
        with: { oauthConfig: { columns: { clientSecretEnc: true } } },
      },
    },
  });
  // biome-ignore lint/complexity/useOptionalChain: more explicit
  if (!refreshToken || !refreshToken.app.oauthConfig) return null;

  try {
    const clientIdMatch = timingSafeEqual(
      Buffer.from(data.clientId),
      Buffer.from(refreshToken.appId),
    );
    const clientSecretMatch = timingSafeEqual(
      hexToBytes(data.clientSecret),
      decrypt(refreshToken.app.oauthConfig.clientSecretEnc),
    );
    if (!clientIdMatch || !clientSecretMatch) {
      return null;
    }
  } catch (_e) {
    // likely an invalid client secret provided to hexToBytes
    return null;
  }

  if (refreshToken.revokedAt) {
    // This refresh token has been reused, so revoke the entire token chain
    // TODO: possibly cache response for a set interval (a few seconds?) to allow for accidental duplicate requests
    await db
      .delete(oauthRefreshTokens)
      .where(
        and(
          eq(oauthRefreshTokens.appId, refreshToken.appId),
          eq(oauthRefreshTokens.userId, refreshToken.userId),
        ),
      );
    return null;
  }

  await db
    .update(oauthRefreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(oauthRefreshTokens.id, refreshToken.id));

  const { appId, userId, sessionId, authTime, scopes } = refreshToken;
  const newTokens = await createTokenPair({
    appId,
    userId,
    sessionId,
    authTime,
    scopes,
  });

  return newTokens;
}
