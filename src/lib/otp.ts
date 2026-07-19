import { timingSafeEqual } from "node:crypto";
import dayjs from "dayjs";
import { customAlphabet } from "nanoid";
import { prisma } from "#/db";
import { genVerificationId } from "./id";

const genOtp = customAlphabet("0123456789", 6);

export async function sendOtp(email: string) {
  const id = genVerificationId();
  const code = genOtp();
  const expiresAt = dayjs().add(15, "minutes").toDate();
  await prisma.verification.create({
    data: {
      id,
      email,
      code,
      expiresAt,
    },
  });

  console.log(`Verification code for ${email}: ${code}`);

  return { id, expiresAt };
}

export async function verifyOtp(id: string, code: string) {
  const verification = await prisma.verification.findUnique({
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

  await prisma.verification.delete({ where: { id } });
  return { email: verification.email };
}
