import { createServerFn } from "@tanstack/react-start";
import { deleteCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { logins } from "#/db/schema/base";
import { getAssetUrl } from "#/lib/assets";
import { verifyOtp } from "#/lib/otp";
import { createSession } from "#/lib/session";
import { requireLogin } from "#/middleware/requireLogin";
import { verifyLoginOtpSchema } from "./schemas";

export const getLogin = createServerFn()
  .middleware([requireLogin])
  .handler(async ({ context }) => {
    const { login } = context;

    const avatar = await db.query.userAvatars.findFirst({
      where: { userId: context.login.user.id },
      with: {
        asset: true,
      },
    });
    const avatarPart = avatar
      ? { id: avatar.asset.id, url: await getAssetUrl(avatar.asset.id) }
      : null;

    return {
      id: login.id,
      email: login.user.email,
      firstName: login.user.firstName,

      avatar: avatarPart,
    };
  });

export const verifyLoginOtp = createServerFn({ method: "POST" })
  .validator(verifyLoginOtpSchema)
  .middleware([requireLogin])
  .handler(async ({ data, context }) => {
    if (!context.login.verificationId) {
      throw new Error("Verification not found");
    }

    await verifyOtp(context.login.verificationId, data.otp);
    await db.delete(logins).where(eq(logins.id, context.login.id));

    deleteCookie(`login_verifier_${context.login.id}`);
    await createSession(context.login.userId);
  });
