import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ConsoleTabLink } from "#/components/console/ConsoleTabItem";

export const Route = createFileRoute("/console/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="p-8 pb-0">
        <h1 className="font-heading text-3xl font-bold">Account</h1>

        <div className="mt-4 flex gap-4 border-b border-neutral-200">
          <ConsoleTabLink
            from={Route.fullPath}
            to="./profile"
            activeProps={{ active: true }}
          >
            Profile
          </ConsoleTabLink>
          <ConsoleTabLink
            from={Route.fullPath}
            to="./security"
            activeProps={{ active: true }}
          >
            Log-in + security
          </ConsoleTabLink>
          <ConsoleTabLink
            from={Route.fullPath}
            to="./apps"
            activeProps={{ active: true }}
          >
            Your apps
          </ConsoleTabLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
