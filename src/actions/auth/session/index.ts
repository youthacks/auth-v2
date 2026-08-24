import { createServerFn } from "@tanstack/react-start";
import { logoutSession } from "#/lib/session";

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await logoutSession();
});
