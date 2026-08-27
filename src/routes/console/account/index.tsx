import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/console/account/")({
  beforeLoad: () => {
    throw redirect({ from: Route.fullPath, to: "./profile", replace: true });
  },
});
