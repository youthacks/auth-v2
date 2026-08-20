import { ORPCError } from "@orpc/client";
import type { sessions, users } from "#/db/schema/base";
import type { oauthAccessTokens } from "#/db/schema/oauth";
import { base, type ServerContext } from "#/lib/orpc";
import { getSession } from "#/lib/session";
import { getAccessToken } from "#/lib/tokens";

type Session = typeof sessions.$inferSelect;
type User = typeof users.$inferSelect;
type AccessToken = typeof oauthAccessTokens.$inferSelect;

type SessionContext = {
  user: User | null;
  session: Session | null;
  accessToken: AccessToken | null;
};

export const maybeSession = base
  .$context<ServerContext & Partial<SessionContext>>()
  .middleware(async ({ context, next }) => {
    if (
      context.user !== undefined &&
      context.session !== undefined &&
      context.accessToken !== undefined
    ) {
      // This middleware has already been run, so skip
      const { user, session, accessToken } = context;
      return next({
        context: { user, session, accessToken } satisfies SessionContext,
      });
    }

    if (context.handler === "rpc") {
      const { user, session } = await getSession();
      return next({
        context: {
          user,
          session,
          accessToken: null,
        } satisfies SessionContext,
      });
    }

    if (context.handler === "openapi") {
      const Authorization = context.reqHeaders?.get("Authorization");
      const { user, session, accessToken } = await getAccessToken(
        "header",
        Authorization,
      );
      return next({
        context: {
          user,
          session,
          accessToken,
        } satisfies SessionContext,
      });
    }

    return next();
  });

export const requireSession = base
  .use(maybeSession)
  .middleware(async ({ context, next }) => {
    if (!context.user) {
      if (context.handler === "rpc") {
        throw new ORPCError("UNAUTHORIZED", {
          message: "Not logged in",
        });
      }
      if (context.handler === "openapi") {
        throw new ORPCError("UNAUTHORIZED", {
          message: "Invalid or expired access token",
        });
      }
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { user: context.user } });
  });
