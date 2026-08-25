import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { orpc } from "#/api/client";
import { ConsoleTabLink } from "#/components/console/ConsoleTabItem";

export const Route = createFileRoute("/console/manage/apps/$id")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      orpc.apps.get.queryOptions({ input: { id: params.id } }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(
    orpc.apps.get.queryOptions({ input: { id: params.id } }),
  );

  return (
    <>
      <div className="p-8 pb-0">
        <div className="mb-2 flex gap-1.5 text-sm text-neutral-600">
          <Link
            from={Route.fullPath}
            to=".."
            className="-m-0.5 -mx-1.5 rounded-sm p-0.5 px-1.5 transition hover:bg-neutral-200"
          >
            Applications
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-sm bg-linear-to-br from-rose-600 to-red-700"></div>
          <h1 className="font-heading mt-0.5 text-3xl font-bold">
            {data.name}
          </h1>
        </div>

        <div className="mt-4 flex gap-4 border-b border-neutral-200">
          <ConsoleTabLink
            from={Route.fullPath}
            to="."
            activeProps={{ active: true }}
            activeOptions={{ exact: true }}
          >
            Settings
          </ConsoleTabLink>
          {data.oauthConfig ? (
            <ConsoleTabLink
              from={Route.fullPath}
              to="./oauth"
              activeProps={{ active: true }}
            >
              OAuth2
            </ConsoleTabLink>
          ) : (
            <ConsoleTabLink
              from={Route.fullPath}
              to="./add"
              activeProps={{ active: true }}
            >
              Authentication
            </ConsoleTabLink>
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
}
