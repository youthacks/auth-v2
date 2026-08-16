import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/oauth/token")({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        // TODO: validate token
      },
    },
  },
});
