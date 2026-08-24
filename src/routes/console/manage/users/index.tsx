import { orpc } from "#/api/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";

export const Route = createFileRoute("/console/manage/users/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.users.all.queryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(orpc.users.all.queryOptions());

  return (
    <>
      <div className="p-8 pb-0">
        <h1 className="font-heading text-3xl font-bold">Users</h1>
      </div>

      <div className="flex gap-4 border-b border-neutral-300 px-8 pt-6 pb-2 text-sm">
        <p className="w-2/5 flex-auto truncate font-semibold">Name</p>
        <p className="w-2/5 flex-auto truncate font-semibold">Email</p>
        <p className="w-1/5 flex-auto truncate font-semibold">Created at</p>
      </div>
      {data.map((user) => (
        <Link
          key={user.id}
          from={Route.fullPath}
          to="$id"
          params={{ id: user.id }}
          className="flex h-12 items-center gap-4 border-b border-neutral-300 px-8 transition hover:bg-neutral-200"
        >
          <div className="flex w-2/5 flex-auto items-center gap-2">
            <div className="size-4 rounded-full bg-linear-to-br from-blue-600 to-indigo-700"></div>
            <p className="min-w-0 flex-1 truncate">
              {`${user.firstName} ${user.lastName}`}
            </p>
          </div>
          <p className="w-2/5 flex-auto truncate">{user.email}</p>
          <p className="w-1/5 flex-auto truncate">
            {dayjs(user.createdAt).fromNow()}
          </p>
        </Link>
      ))}
    </>
  );
}
