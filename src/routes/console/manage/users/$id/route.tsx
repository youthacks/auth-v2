import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { orpc } from "#/api/client";
import { ConsoleTabLink } from "#/components/console/ConsoleTabItem";

export const Route = createFileRoute("/console/manage/users/$id")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      orpc.users.get.queryOptions({ input: { id: params.id } }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(
    orpc.users.get.queryOptions({ input: { id: params.id } }),
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
            Users
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-linear-to-br from-blue-600 to-indigo-700"></div>
          <h1 className="font-heading mt-0.5 text-3xl font-bold">
            {data.firstName} {data.lastName}
          </h1>
        </div>

        <div className="mt-4 flex gap-4 border-b border-neutral-200">
          <ConsoleTabLink
            from={Route.fullPath}
            to="."
            activeProps={{ active: true }}
            activeOptions={{ exact: true }}
          >
            Profile
          </ConsoleTabLink>
          <ConsoleTabLink
            from={Route.fullPath}
            to="./apps"
            activeProps={{ active: true }}
          >
            Apps
          </ConsoleTabLink>
        </div>
      </div>

      <Outlet />
    </>
  );
}
