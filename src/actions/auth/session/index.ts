import { createServerFn } from "@tanstack/react-start";
import { logoutSession } from "#/lib/session";
import { maybeSession } from "./middleware";

export const getCurrentSession = createServerFn()
  .middleware([maybeSession])
  .handler(async ({ context }) => {
    if (!context.session) {
      return null;
    }

    return {
      id: context.session.id,
    };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await logoutSession();
});
