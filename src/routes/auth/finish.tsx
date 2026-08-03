import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/finish")({
  beforeLoad: () => {
    throw redirect({ to: "/console" });
  },
});
