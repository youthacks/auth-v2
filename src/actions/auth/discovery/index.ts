import { createServerFn } from "@tanstack/react-start";
import { discoverLoginSchema } from "./schemas";

export const discoverLogin = createServerFn({ method: "POST" })
  .validator(discoverLoginSchema)
  .handler(async ({ data }) => {
    return { type: "signup" as const };
  });
