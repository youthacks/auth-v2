import { createFileRoute } from "@tanstack/react-router";
import Button from "#/components/ui/Button";

export const Route = createFileRoute("/console/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8">
      <div className="space-y-8">
        <section>
          <h2 className="font-heading text-xl font-bold">Profile</h2>
          <p className="mt-0.5 text-sm text-neutral-600">
            A little about you. Only your display name is publicly visible.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">Danger zone</h2>
          <p className="mt-0.5 text-sm text-neutral-600">Scary things ahead.</p>
          <div className="mt-3 flex gap-3 opacity-50">
            <Button size="sm">Deactivate account</Button>
            <Button size="sm" color="danger">
              Delete account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
