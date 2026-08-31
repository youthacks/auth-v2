import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/auth/login/$id")({
  head: () => ({
    meta: [
      {
        title: "Log in - Youthacks Account",
      },
    ],
  }),
});
