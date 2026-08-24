import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { CircleIcon, TriangleIcon } from "lucide-react";

export const Route = createFileRoute("/console/manage/apps/$id/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="p-8 pb-0">
        <div className="grid grid-cols-2 gap-4">
          <Link
            from={Route.fullPath}
            to="./oauth"
            className="flex h-fit gap-3 rounded-md border p-3 shadow-xs transition active:scale-95"
            activeProps={{
              className: "border-amber-300 bg-amber-100",
            }}
            inactiveProps={{
              className: "border-neutral-300",
            }}
          >
            <div className="grid size-10 flex-none place-items-center rounded-sm bg-amber-200 text-amber-700">
              <CircleIcon className="size-5" />
            </div>
            <div>
              <p>OAuth2 / OIDC</p>
              <p className="text-xs text-neutral-600">
                Widely supported, and easy to use.
              </p>
            </div>
          </Link>
          <Link
            from={Route.fullPath}
            to="./saml"
            className="flex h-fit gap-3 rounded-md border p-3 shadow-xs transition active:scale-95"
            activeProps={{
              className: "border-cyan-300 bg-cyan-100",
            }}
            inactiveProps={{
              className: "border-neutral-300",
            }}
          >
            <div className="grid size-10 flex-none place-items-center rounded-sm bg-cyan-200 text-cyan-700">
              <TriangleIcon className="size-5" />
            </div>
            <div>
              <p>SAML 2.0</p>
              <p className="text-xs text-neutral-600">
                For advanced use-cases, or if your app only supports SAML.
              </p>
            </div>
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}
