import z from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  isLastNameFirst: z.boolean(),
  dateOfBirth: z.iso.date("Date of birth is required"),
  avatarAssetId: z.string().nullable(),
});
