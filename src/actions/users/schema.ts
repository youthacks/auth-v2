import z from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  isLastNameFirst: z.boolean(),
  dateOfBirth: z.iso.date("Date of birth is required"),
  avatar: z
    .file()
    .mime(["image/png", "image/jpeg"], "Avatar must be a PNG or JPEG image")
    .max(5_000_000, "Avatar must be less than 5MB")
    .nullable()
    .or(z.undefined()),
});
