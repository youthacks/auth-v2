import { createServerFn } from "@tanstack/react-start";
import { logoutSession } from "#/lib/session";
import { maybeSession } from "#/middleware/requireSession";

export const getCurrentUser = createServerFn()
  .middleware([maybeSession])
  .handler(async ({ context }) => {
    if (!context.user) {
      return null;
    }

    const user = {
      id: context.user.id,
      email: context.user.email,
      firstName: context.user.firstName,
      lastName: context.user.lastName,
      dateOfBirth: context.user.dateOfBirth,
    };
    return user;
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await logoutSession();
});
