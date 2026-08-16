import { createServerFn } from "@tanstack/react-start";
import { requireSession } from "#/middleware/requireSession";
import { oauthAuthorizeSchema } from "./schemas";
import { prisma } from "#/db";
import z from "zod";
import { nanoid } from "nanoid";

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
    const oauth2Config = await prisma.appOAuth2Config.findUnique({
      where: { clientId: data.client_id },
    });
    if (!oauth2Config) {
      throw new Error("Invalid client_id");
    }

    const allowedRedirectUris = new Set(
      oauth2Config.allowedCallbackUrls.split("\n"),
    );
    if (!allowedRedirectUris.has(data.redirect_uri)) {
      throw new Error("Invalid redirect_uri");
    }

    const code = nanoid(32);

    // TODO: add expiration time for exchange codes
    await prisma.oAuthExchangeCode.create({
      data: {
        code,
        scopes: data.scope,
        appId: oauth2Config.appId,
        userId: context.user.id,
      },
    });

    return { code };
  });

export const oauthGetAppInfo = createServerFn()
  .middleware([requireSession])
  .validator(oauthAuthorizeSchema)
  .handler(async ({ data, context }) => {
    const oauth2Config = await prisma.appOAuth2Config.findUnique({
      where: { clientId: data.client_id },
      select: {
        app: {
          include: {
            owner: true,
          },
        },
      },
    });
    if (!oauth2Config) {
      throw new Error("Invalid client_id");
    }

    return {
      name: oauth2Config.app.name,
      owner: {
        firstName: oauth2Config.app.owner.firstName,
      },
    };
  });
