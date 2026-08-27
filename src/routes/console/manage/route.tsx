import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/console/manage")({
  beforeLoad: async ({ context }) => {
    if (context.user.role !== "admin") {
      throw redirect({ to: "/console", replace: true });
    }
  },
});
