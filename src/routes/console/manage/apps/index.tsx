import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PlusIcon } from "lucide-react";
import { orpc } from "#/api/client";
import Button from "#/components/ui/Button";
import { Dialog } from "#/components/ui/Dialog";
import NewAppDialog from "./-new";

dayjs.extend(relativeTime);

export const Route = createFileRoute("/console/manage/apps/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.apps.all.queryOptions());
  },
  component: RouteComponent,
});

const newAppDialog = Dialog.createHandle();

function RouteComponent() {
  const { data } = useSuspenseQuery(orpc.apps.all.queryOptions());

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between gap-4">
          <h1 className="font-heading min-h-10 text-3xl font-bold">
            Applications
          </h1>
          <Dialog.Trigger
            handle={newAppDialog}
            render={<Button color="primary" size="md" />}
          >
            <PlusIcon strokeWidth={2.5} className="size-4" />
            New
          </Dialog.Trigger>
        </div>

        <div className="mt-4 divide-y divide-neutral-200 overflow-clip rounded-lg border border-neutral-200">
          <div className="flex gap-4 bg-neutral-100 px-3 py-1.5 text-sm">
            <p className="min-w-0 flex-1 truncate font-medium">Name</p>
            <p className="w-48 flex-none truncate font-medium">Created at</p>
          </div>
          {data.map((app) => (
            <Link
              key={app.id}
              from={Route.fullPath}
              params={{ id: app.id }}
              to="$id"
              className="group flex h-14 items-center gap-4 px-3 transition hover:bg-neutral-100"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="size-8 rounded-sm bg-linear-to-br from-rose-600 to-red-700"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-rose-700 group-hover:text-rose-900">
                    {app.name}
                  </p>
                  <p className="text-xs text-neutral-600">{app.homepageUrl}</p>
                </div>
              </div>
              <p
                title={dayjs(app.createdAt).toString()}
                className="w-48 flex-none truncate text-sm underline decoration-dotted underline-offset-2"
              >
                {dayjs(app.createdAt).fromNow()}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <NewAppDialog handle={newAppDialog} />
    </>
  );
}
