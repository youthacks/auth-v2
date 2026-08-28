import { Elysia, status } from "elysia";
import { getAccessToken } from "#/lib/tokens";

export const base = new Elysia({ name: "base" })
  .derive({ as: "global" }, async ({ headers }) => {
    const { user, session, accessToken } = await getAccessToken(
      "header",
      headers.authorization,
    );

    return { user, session, accessToken };
  })
  .macro({
    auth: {
      resolve: async ({ user, session, accessToken }) => {
        if (!user || !accessToken) {
          return status(401);
        }

        return { user, session, accessToken };
      },
    },
    scopes: (scopes: string[]) => ({
      resolve: async ({ user, session, accessToken }) => {
        if (!user || !accessToken) {
          return status(401);
        }

        const tokenScopes = accessToken.scopes.split(" ");
        const hasScopes = scopes.some((scope) => tokenScopes.includes(scope));
        if (!hasScopes) {
          console.log("scopes missing", { required: scopes, tokenScopes });
          return status(403);
        }

        return { user, session, accessToken };
      },
    }),
  });
