import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setCookie } from "@tanstack/react-start/server";
import { nanoid } from "nanoid";
import { db } from "#/db";
import { logins } from "#/db/schema/base";
import { sendOtp } from "#/lib/otp";
import sha256 from "#/lib/sha256";
import { getSessionName } from "#/lib/userAgent";
import { discoverLoginSchema } from "./schemas";

export const discoverLogin = createServerFn({ method: "POST" })
  .validator(discoverLoginSchema)
  .handler(async ({ data }) => {
    const existingUser = await db.query.users.findFirst({
      where: { email: data.email },
      columns: { id: true, firstName: true },
    });

    if (existingUser) {
      const verifier = nanoid(32);
      const verifierHash = await sha256(verifier);

      const userAgent = getRequestHeader("User-Agent");
      const deviceName = getSessionName(userAgent);

      const { id: verificationId, expiresAt } = await sendOtp(data.email, {
        firstName: existingUser.firstName,
        deviceName,
      });

      const [{ id }] = await db
        .insert(logins)
        .values({
          userId: existingUser.id,
          verifierHash: Buffer.from(verifierHash),
          verificationId,
        })
        .returning();

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
