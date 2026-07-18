import { createFileRoute } from "@tanstack/react-router";

import Button from "#/components/ui/Button";

export const Route = createFileRoute("/auth/finish")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold">You're signed in</h1>
      <p className="mt-1.5 text-neutral-600 italic">
        Later, this is where you would be redirected to the dashboard. For now,
        it's just a finish screen{" "}
        <span className="ml-0.5 inline-block -translate-y-1">._.</span>
      </p>

      <Button
        onClick={() => navigate({ to: "/auth" })}
        className="mt-6 w-full"
        size="lg"
        color="primary"
      >
        Start again
      </Button>
    </div>
  );
}
