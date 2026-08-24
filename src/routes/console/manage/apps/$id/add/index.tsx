import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/console/manage/apps/$id/add/")({
  beforeLoad: () => {
    throw redirect({ from: Route.fullPath, to: "./oauth" });
  },
});
