import { timingSafeEqual } from "node:crypto";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { db } from "#/db";
import { verifications } from "#/db/schema/base";
import VerifyEmail from "#emails/verify-email";
import { resend } from "./email";

const genOtp = customAlphabet("0123456789", 6);

export async function sendOtp(
  email: string,
  data: { firstName: string; deviceName?: string },
) {
  const code = genOtp();
  const expiresAt = dayjs().add(15, "minutes").toDate();
  const [{ id }] = await db
    .insert(verifications)
    .values({
      email,
      code,
      expiresAt,
    })
    .returning();

  if (process.env.NODE_ENV === "production") {
    if (process.env.RESEND_FROM) {
      void resend.emails.send({
        from: process.env.RESEND_FROM,
        to: email,
        subject: `${code} is your Youthacks login code`,
        react: VerifyEmail({
          firstName: data.firstName,
          code,
          deviceName: data.deviceName,
          expiresInMinutes: 15,
        }),
      });
    } else {
      console.error("RESEND_FROM environment variable is not set");
    }
  } else {
    console.log(`Verification code for ${email}: ${code}`);
  }

  return { id, expiresAt };
}

export async function verifyOtp(id: string, code: string) {
  const verification = await db.query.verifications.findFirst({
    where: { id, expiresAt: { gt: new Date() } },
  });

  if (!verification) {
    throw new Error("Verification not found");
  }

  const isValid = timingSafeEqual(
    Buffer.from(verification.code),
    Buffer.from(code),
  );
  if (!isValid) {
    throw new Error("Invalid verification code");
  }

  await db.delete(verifications).where(eq(verifications.id, id));
  return { email: verification.email };
}
