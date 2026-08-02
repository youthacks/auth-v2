import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/console/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold">Account</h1>
    </div>
  );
}
