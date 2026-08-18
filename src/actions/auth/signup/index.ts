import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "#/db";
import { signups, users } from "#/db/schema/base";
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
    const existingUser = await db.query.users.findFirst({
      where: { email: data.email },
      columns: { id: true },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const verifier = nanoid(32);
    const verifierHash = await sha256(verifier);

    const { id: verificationId, expiresAt } = await sendOtp(data.email);

    const [{ id }] = await db
      .insert(signups)
      .values({
        ...data,
        verifierHash: Buffer.from(verifierHash),
        verificationId,
      })
      .returning();

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
    await db
      .update(signups)
      .set({ emailVerified: true })
      .where(eq(signups.id, context.signup.id));
  });

export const acceptSignupTerms = createServerFn({ method: "POST" })
  .middleware([requireSignup])
  .validator(acceptSignupTermsSchema)
  .handler(async ({ context }) => {
    if (!context.signup.emailVerified) {
      throw new Error("Email not verified");
    }

    const userId = await db.transaction(async (tx) => {
      await tx.delete(signups).where(eq(signups.id, context.signup.id));
      const [{ id }] = await tx
        .insert(users)
        .values({
          email: context.signup.email,
          firstName: context.signup.firstName,
          lastName: context.signup.lastName,
          dateOfBirth: context.signup.dateOfBirth,
        })
        .returning();
      return id;
    });

    deleteCookie(`signup_verifier_${context.signup.id}`);
    await createSession(userId);
  });
