import { createServerFn } from "@tanstack/react-start";
import {
  acceptSignupTermsSchema,
  createSignupSchema,
  verifySignupOtpSchema,
} from "./schemas";

export const createSignup = createServerFn({ method: "POST" })
  .validator(createSignupSchema)
  .handler(async ({ data }) => {
    return { id: "s:123" };
  });

export const verifySignupOtp = createServerFn({ method: "POST" })
  .validator(verifySignupOtpSchema)
  .handler(async ({ data }) => {
    return;
  });

export const acceptSignupTerms = createServerFn({ method: "POST" })
  .validator(acceptSignupTermsSchema)
  .handler(async ({ data }) => {
    return;
  });
