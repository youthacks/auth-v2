import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { orpc } from "#/api/client";

export const Route = createFileRoute("/console/manage/users/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.users.all.queryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(orpc.users.all.queryOptions());

  return (
    <div className="p-8">
      <h1 className="font-heading min-h-10 text-3xl font-bold">Users</h1>

      <div className="mt-4 divide-y divide-neutral-200 overflow-clip rounded-lg border border-neutral-200">
        <div className="flex gap-4 bg-neutral-50 px-3 py-1.5 text-sm">
          <p className="min-w-0 flex-1 truncate font-medium">Name</p>
          <p className="w-48 flex-none truncate font-medium">Created at</p>
        </div>
        {data.map((user) => (
          <Link
            key={user.id}
            from={Route.fullPath}
            params={{ id: user.id }}
            to="$id"
            className="group flex h-14 items-center gap-4 px-3 transition hover:bg-neutral-100"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="size-8 rounded-full bg-linear-to-br from-blue-600 to-indigo-700"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-rose-700 group-hover:text-rose-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-neutral-600">{user.email}</p>
              </div>
            </div>
            <p
              title={dayjs(user.createdAt).toString()}
              className="w-48 flex-none truncate text-sm underline decoration-dotted underline-offset-2"
            >
              {dayjs(user.createdAt).fromNow()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
