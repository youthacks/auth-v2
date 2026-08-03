import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/console/manage/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold">Users</h1>
    </div>
  );
}
