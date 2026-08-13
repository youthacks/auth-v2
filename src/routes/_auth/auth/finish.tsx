import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/auth/finish")({
  beforeLoad: ({ search }) => {
    if (search.return_to) {
      throw redirect({ href: search.return_to });
    }

    throw redirect({ to: "/console" });
  },
});
