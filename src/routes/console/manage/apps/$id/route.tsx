import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { getAppByIdQuery } from "#/actions/console/manage/apps/queries";

export const Route = createFileRoute("/console/manage/apps/$id")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      getAppByIdQuery({ id: params.id }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(getAppByIdQuery({ id: params.id }));

  return (
    <>
      <div className="p-8 pb-0">
        <div className="mb-2 flex gap-1.5 text-sm text-neutral-600">
          <Link
            to="/console/manage/apps"
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
      </div>

      <div className="sticky top-0 z-10 flex gap-5 border-b border-neutral-300 bg-white px-8 pt-4">
        <Link
          from={Route.fullPath}
          to="."
          className="group -mb-0.5 border-b-[3px] py-1.5 text-sm font-medium"
          activeProps={{
            className: "border-rose-700 text-rose-700",
          }}
          activeOptions={{
            exact: true,
          }}
          inactiveProps={{
            className:
              "border-transparent text-neutral-600 transition-colors hover:border-neutral-300",
          }}
        >
          Settings
        </Link>
        {data.oauth2Config ? (
          <Link
            from={Route.fullPath}
            to="./oauth2"
            className="group -mb-0.5 border-b-[3px] py-1.5 text-sm font-medium"
            activeProps={{
              className: "border-rose-700 text-rose-700",
            }}
            inactiveProps={{
              className:
                "border-transparent text-neutral-600 transition-colors hover:border-neutral-300",
            }}
          >
            OAuth2
          </Link>
        ) : (
          <Link
            from={Route.fullPath}
            to="./add"
            className="group -mb-0.5 border-b-[3px] py-1.5 text-sm font-medium"
            activeProps={{
              className: "border-rose-700 text-rose-700",
            }}
            inactiveProps={{
              className:
                "border-transparent text-neutral-600 transition-colors hover:border-neutral-300",
            }}
          >
            Authentication
          </Link>
        )}
      </div>

      <Outlet />
    </>
  );
}
