import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import z from "zod";
import { requireSession } from "#/api/middleware/requireSession";
import { db } from "#/db";
import { base } from "#/lib/orpc";

export const getConsents = base
  .meta(openapi({ method: "GET", path: "/users/{id}/consents" }))
  .use(requireSession)
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: { id: input.id },
      columns: {},
      with: {
        appConsents: {
          with: {
            app: { columns: { name: true, homepageUrl: true } },
          },
        },
      },
    });
    if (!user) {
      throw new ORPCError("NOT_FOUND");
    }

    return user.appConsents;
  });

export const getMeConsents = base
  .meta(openapi({ method: "GET", path: "/users/me/consents" }))
  .use(requireSession)
  .handler(async ({ context }) => {
    const consents = await db.query.applicationConsents.findMany({
      where: { userId: context.user.id },
      with: {
        app: { columns: { name: true, homepageUrl: true } },
      },
    });

    return consents;
  });
