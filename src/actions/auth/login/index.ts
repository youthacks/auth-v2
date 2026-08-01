import { createServerFn } from "@tanstack/react-start";
import { deleteCookie } from "@tanstack/react-start/server";
import { prisma } from "#/db";
import { verifyOtp } from "#/lib/otp";
import { createSession } from "#/lib/session";
import { requireLogin } from "#/middleware/requireLogin";
import { verifyLoginOtpSchema } from "./schemas";

export const getLogin = createServerFn()
  .middleware([requireLogin])
  .handler(async ({ context }) => {
    const { login } = context;
    return {
      id: login.id,
      email: login.user.email,
      firstName: login.user.firstName,
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
    await prisma.login.delete({
      where: { id: context.login.id },
    });

    deleteCookie(`login_verifier_${context.login.id}`);
    await createSession(context.login.userId);
  });
