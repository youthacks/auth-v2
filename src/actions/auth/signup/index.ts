import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, setCookie } from "@tanstack/react-start/server";
import { nanoid } from "nanoid";
import { prisma } from "#/db";
import { genSignupId, genUserId } from "#/lib/id";
import { sendOtp, verifyOtp } from "#/lib/otp";
import { createSession } from "#/lib/session";
import sha256 from "#/lib/sha256";
import { requireSignup } from "#/middleware/requireSignup";
import {
  acceptSignupTermsSchema,
  createSignupSchema,
  verifySignupOtpSchema,
} from "./schemas";

export const createSignup = createServerFn({ method: "POST" })
  .validator(createSignupSchema)
  .handler(async ({ data }) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const id = genSignupId();
    const verifier = nanoid(32);
    const verifierHash = await sha256(verifier);
    const { dateOfBirth, ...rest } = data;

    const { id: verificationId, expiresAt } = await sendOtp(data.email);

    await prisma.signup.create({
      data: {
        ...rest,
        dateOfBirth: new Date(dateOfBirth),
        id,
        verifierHash,
        verificationId,
      },
    });

    setCookie(`signup_verifier_${id}`, verifier, {
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
    });

    return { id };
  });

export const getSignup = createServerFn()
  .middleware([requireSignup])
  .handler(async ({ context }) => {
    const { signup } = context;
    return {
      id: signup.id,
      email: signup.email,
      firstName: signup.firstName,
      emailVerified: signup.emailVerified,
    };
  });

export const verifySignupOtp = createServerFn({ method: "POST" })
  .validator(verifySignupOtpSchema)
  .middleware([requireSignup])
  .handler(async ({ data, context }) => {
    if (!context.signup.verificationId) {
      throw new Error("Verification not found");
    }

    await verifyOtp(context.signup.verificationId, data.otp);
    await prisma.signup.update({
      where: { id: context.signup.id },
      data: { emailVerified: true },
    });
  });

export const acceptSignupTerms = createServerFn({ method: "POST" })
  .middleware([requireSignup])
  .validator(acceptSignupTermsSchema)
  .handler(async ({ context }) => {
    if (!context.signup.emailVerified) {
      throw new Error("Email not verified");
    }

    const userId = genUserId();

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          email: context.signup.email,
          firstName: context.signup.firstName,
          lastName: context.signup.lastName,
          dateOfBirth: context.signup.dateOfBirth,
        },
      });
      await tx.signup.delete({
        where: { id: context.signup.id },
      });
    });

    deleteCookie(`signup_verifier_${context.signup.id}`);
    await createSession(userId);
  });
