import z from "zod";

export const createAppSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string(),
  homepageUrl: z.string().min(1, "Required"),
});
