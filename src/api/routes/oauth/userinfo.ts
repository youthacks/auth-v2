import { openapi } from "@orpc/openapi";
import { requireSession } from "#/api/middleware/requireSession";
import { base } from "#/lib/orpc";

export const userInfo = base
  .meta(openapi({ method: "GET", path: "/userinfo" }))
  .use(requireSession)
  .handler(async ({ context }) => {
    // TODO: verify scopes
    const { user } = context;
    return {
      sub: user.id,
      name: `${user.firstName} ${user.lastName}`,
      given_name: user.firstName,
      family_name: user.lastName,
      nickname: user.firstName,
      updated_at: user.updatedAt,

      email: user.email,
      email_verified: true,
      birthdate: user.dateOfBirth,
    };
  });
