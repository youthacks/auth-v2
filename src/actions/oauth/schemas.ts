import z from "zod";

const zScope = z.string().refine((scope) => {
  const allowedScopes = ["openid", "profile", "email", "birthdate"];
  const scopes = scope.split(/\s/).filter(Boolean);

  return scopes.every((scope) => allowedScopes.includes(scope));
}, "Invalid scope");

export const oauthAuthorizeSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.url(),
  response_type: z.literal("code"),
  scope: zScope,
  state: z.string().optional(),
});
