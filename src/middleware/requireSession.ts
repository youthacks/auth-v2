import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "#/lib/session";

export const maybeSession = createMiddleware().server(async ({ next }) => {
  const { session, user } = await getSession();

  return next({
    context: { session, user },
  });
});

export const requireSession = createMiddleware().server(async ({ next }) => {
  const { session, user } = await getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  return next({
    context: { session, user },
  });
});
