import { z } from "zod";

export const verifyLoginOtpSchema = z.object({
  otp: z.string().length(6, "One-time code is required"),
});
