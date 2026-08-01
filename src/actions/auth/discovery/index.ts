import { createServerFn } from "@tanstack/react-start";
import { discoverLoginSchema } from "./schemas";
import { prisma } from "#/db";
import { setCookie } from "@tanstack/react-start/server";
import { sendOtp } from "#/lib/otp";
import { genLoginId } from "#/lib/id";
import { nanoid } from "nanoid";
import sha256 from "#/lib/sha256";

export const discoverLogin = createServerFn({ method: "POST" })
  .validator(discoverLoginSchema)
  .handler(async ({ data }) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const id = genLoginId();
      const verifier = nanoid(32);
      const verifierHash = await sha256(verifier);

      const { id: verificationId, expiresAt } = await sendOtp(data.email);

      await prisma.login.create({
        data: {
          id,
          userId: existingUser.id,
          verifierHash,
          verificationId,
        },
      });

      setCookie(`login_verifier_${id}`, verifier, {
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
      });

      return { type: "login" as const, id };
    } else {
      return { type: "signup" as const };
    }
  });
