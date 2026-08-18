import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { applicationOAuthConfig } from "#/db/schema/applications";
import { bytesToHex, decrypt, encrypt } from "#/lib/encryption";
import { withApplication } from "#/middleware/withApplication";
import { createAppOAuth2Schema } from "./schemas";

export const createAppOAuth2 = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(createAppOAuth2Schema)
  .handler(async ({ data, context }) => {
    const clientSecret = crypto.getRandomValues(new Uint8Array(32));
    const clientSecretEnc = encrypt(clientSecret);

    await db.insert(applicationOAuthConfig).values({
      appId: context.app.id,
      clientSecretEnc: Buffer.from(clientSecretEnc),
      allowedCallbackUrls: data.allowedCallbackUrls.join("\n"),
    });
  });

export const getAppOAuth2Config = createServerFn({ method: "GET" })
  .middleware([withApplication])
  .handler(async ({ context }) => {
    const config = await db.query.applicationOAuthConfig.findFirst({
      where: { appId: context.app.id },
    });

    if (!config) {
      throw new Error("OAuth2 config not found");
    }

    const clientSecret = bytesToHex(decrypt(config.clientSecretEnc));

    return {
      clientId: config.appId,
      clientSecret,
      allowedCallbackUrls: config.allowedCallbackUrls.split("\n"),
    };
  });

export const updateAppOAuth2Config = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(createAppOAuth2Schema)
  .handler(async ({ data, context }) => {
    await db
      .update(applicationOAuthConfig)
      .set({
        allowedCallbackUrls: data.allowedCallbackUrls.join("\n"),
      })
      .where(eq(applicationOAuthConfig.appId, context.app.id));
  });
