import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/auth/signup")({
  head: () => ({
    meta: [
      {
        title: "Sign up - Youthacks Account",
      },
    ],
  }),
});
