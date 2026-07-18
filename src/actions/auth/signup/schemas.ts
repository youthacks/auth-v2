import { z } from "zod";

export const createSignupSchema = z.object({
  email: z.email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.iso.date("Date of birth is required"),
});

export const verifySignupOtpSchema = z.object({
  otp: z.string().length(6, "One-time code is required"),
});

export const acceptSignupTermsSchema = z.object({
  termsAccepted: z.boolean().refine((v) => v === true),
  privacyAccepted: z.boolean().refine((v) => v === true),
});
