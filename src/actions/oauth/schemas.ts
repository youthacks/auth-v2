import z from "zod";

export const oauthAuthorizeSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.url(),
  response_type: z.literal("code"),
  scope: z.string(),
  state: z.string().optional(),
});
