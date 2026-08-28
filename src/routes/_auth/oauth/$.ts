import { createFileRoute } from "@tanstack/react-router";
import { oauthApi } from "#/elysia/oauth";

export const Route = createFileRoute("/_auth/oauth/$")({
  server: {
    handlers: {
      ANY: ({ request }) => oauthApi.fetch(request),
    },
  },
});
