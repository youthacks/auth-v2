import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { applicationOAuthConfig } from "#/db/schema/applications";
import { bytesToHex, decrypt, encrypt } from "#/lib/encryption";
import { withApplication } from "../middleware";
import { appOAuthSchema } from "./schemas";

export const createOAuthConfig = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(appOAuthSchema)
  .handler(async ({ context, data }) => {
    const clientSecret = crypto.getRandomValues(new Uint8Array(32));
    const clientSecretEnc = encrypt(clientSecret);

    await db.insert(applicationOAuthConfig).values({
      appId: context.app.id,
      clientSecretEnc: Buffer.from(clientSecretEnc),
      allowedCallbackUrls: data.allowedCallbackUrls.join("\n"),
    });
  });

export const getOAuthConfig = createServerFn()
  .middleware([withApplication])
  .handler(async ({ context }) => {
    const oauthConfig = await db.query.applicationOAuthConfig.findFirst({
      where: { appId: context.app.id },
    });
    if (!oauthConfig) {
      throw new Error("Application config not found");
    }

    const clientSecret = bytesToHex(decrypt(oauthConfig.clientSecretEnc));

    return {
      clientId: oauthConfig.appId,
      clientSecret,
      allowedCallbackUrls: oauthConfig.allowedCallbackUrls.split("\n"),
    };
  });

export const updateOAuthConfig = createServerFn({ method: "POST" })
  .middleware([withApplication])
  .validator(appOAuthSchema)
  .handler(async ({ context, data }) => {
    await db
      .update(applicationOAuthConfig)
      .set({
        allowedCallbackUrls: data.allowedCallbackUrls.join("\n"),
      })
      .where(eq(applicationOAuthConfig.appId, context.app.id));
  });
