import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { listUsersQuery } from "#/actions/users/queries";
import { DefaultAvatar } from "#/components/ui/Avatar";

export const Route = createFileRoute("/console/manage/users/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(listUsersQuery());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(listUsersQuery());

  return (
    <div className="p-8">
      <h1 className="min-h-10 font-heading text-3xl font-bold">Users</h1>

      <div className="mt-4 divide-y divide-neutral-200 overflow-clip rounded-lg border border-neutral-200">
        <div className="flex gap-4 bg-neutral-100 px-4 py-1.5 text-sm">
          <p className="min-w-0 flex-1 truncate font-medium">Name</p>
          <p className="w-48 flex-none truncate font-medium max-sm:hidden">
            Created at
          </p>
        </div>
        {data.map((user) => (
          <Link
            key={user.id}
            from={Route.fullPath}
            params={{ id: user.id }}
            to="$id"
            className="group flex h-16 items-center gap-4 px-4 transition hover:bg-neutral-100"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="size-8 flex-none overflow-clip rounded-full border border-neutral-200">
                {user.avatar ? (
                  <img
                    src={user.avatar.url}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <DefaultAvatar>{user.firstName[0]}</DefaultAvatar>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-rose-700 group-hover:text-rose-900">
                  {user.isLastNameFirst
                    ? `${user.lastName} ${user.firstName}`
                    : `${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-xs text-neutral-600">{user.email}</p>
              </div>
            </div>
            <p
              title={dayjs(user.createdAt).toString()}
              className="w-48 flex-none truncate text-sm underline decoration-dotted underline-offset-2 max-sm:hidden"
            >
              {dayjs(user.createdAt).fromNow()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
