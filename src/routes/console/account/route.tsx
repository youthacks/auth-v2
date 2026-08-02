import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/console/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="p-8 pb-0">
        <h1 className="font-heading text-3xl font-bold">Account</h1>
      </div>

      <div className="sticky top-0 flex gap-5 border-b border-neutral-300 bg-white px-8 pt-4">
        <Link
          from={Route.fullPath}
          to="./profile"
          className="group -mb-0.5 border-b-[3px] py-1.5 text-sm font-medium"
          activeProps={{
            className: "border-rose-700 text-rose-700",
          }}
          inactiveProps={{
            className:
              "border-transparent text-neutral-600 transition-colors hover:border-neutral-300",
          }}
        >
          Profile
        </Link>
        <Link
          from={Route.fullPath}
          to="./security"
          className="group -mb-0.5 border-b-[3px] py-1.5 text-sm font-medium"
          activeProps={{
            className: "border-rose-700 text-rose-700",
          }}
          inactiveProps={{
            className:
              "border-transparent text-neutral-600 transition-colors hover:border-neutral-300",
          }}
        >
          Log-in + security
        </Link>
        <Link
          from={Route.fullPath}
          to="./apps"
          className="group -mb-0.5 border-b-[3px] py-1.5 text-sm font-medium"
          activeProps={{
            className: "border-rose-700 text-rose-700",
          }}
          inactiveProps={{
            className:
              "border-transparent text-neutral-600 transition-colors hover:border-neutral-300",
          }}
        >
          Your apps
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
