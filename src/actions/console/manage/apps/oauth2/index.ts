import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/db";
import { bytesToHex, decrypt, encrypt } from "#/lib/encryption";
import { withApplication } from "#/middleware/withApplication";
import { createAppOAuth2Schema } from "./schemas";

export const createAppOAuth2 = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(createAppOAuth2Schema)
  .handler(async ({ data, context }) => {
    const clientSecret = crypto.getRandomValues(new Uint8Array(32));
    const encryptedClientSecret = encrypt(clientSecret);

    await prisma.appOAuth2Config.create({
      data: {
        appId: context.app.id,
        clientId: context.app.id,
        encryptedClientSecret,

        allowedCallbackUrls: data.allowedCallbackUrls.join("\n"),
      },
    });
  });

export const getAppOAuth2Config = createServerFn({ method: "GET" })
  .middleware([withApplication])
  .handler(async ({ context }) => {
    const config = await prisma.appOAuth2Config.findUnique({
      where: { appId: context.app.id },
    });

    if (!config) {
      throw new Error("OAuth2 config not found");
    }

    const clientSecret = bytesToHex(decrypt(config.encryptedClientSecret));

    return {
      clientId: config.clientId,
      clientSecret,
      allowedCallbackUrls: config.allowedCallbackUrls.split("\n"),
    };
  });

export const updateAppOAuth2Config = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(createAppOAuth2Schema)
  .handler(async ({ data, context }) => {
    await prisma.appOAuth2Config.update({
      where: { appId: context.app.id },
      data: {
        allowedCallbackUrls: data.allowedCallbackUrls.join("\n"),
      },
    });
  });
