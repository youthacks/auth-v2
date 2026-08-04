import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/console/manage/apps/$id/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="p-8">Hello "/console/manage/apps/$id/auth"!</div>;
}
