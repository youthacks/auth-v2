import { z } from "zod";

export const discoverLoginSchema = z.object({
  email: z.email("Invalid email"),
});
