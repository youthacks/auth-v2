import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PlusIcon } from "lucide-react";

import { getAllAppsQuery } from "#/actions/console/manage/apps/queries";
import Button from "#/components/ui/Button";
import { Dialog } from "#/components/ui/Dialog";
import NewAppDialog from "./-new";
import { Link } from "@tanstack/react-router";

dayjs.extend(relativeTime);

export const Route = createFileRoute("/console/manage/apps/")({
  component: RouteComponent,
});

const newAppDialog = Dialog.createHandle();

function RouteComponent() {
  const { data } = useSuspenseQuery(getAllAppsQuery());

  return (
    <>
      <div className="p-8 pb-0">
        <div className="flex justify-between gap-4">
          <h1 className="font-heading text-3xl font-bold">Applications</h1>
          <Dialog.Trigger
            handle={newAppDialog}
            render={<Button color="primary" />}
          >
            <PlusIcon strokeWidth={2.5} className="size-4" />
            New
          </Dialog.Trigger>
        </div>
      </div>

      <div className="flex gap-4 border-b border-neutral-300 px-8 pt-6 pb-2 text-sm">
        <p className="w-2/5 flex-auto truncate font-semibold">Name</p>
        <p className="w-2/5 flex-auto truncate font-semibold">Homepage URL</p>
        <p className="w-1/5 flex-auto truncate font-semibold">Created at</p>
      </div>
      {data.map((app) => (
        <Link
          key={app.id}
          from={Route.fullPath}
          params={{ id: app.id }}
          to="$id"
          className="flex h-12 items-center gap-4 border-b border-neutral-300 px-8 transition hover:bg-neutral-200"
        >
          <div className="flex w-2/5 flex-auto items-center gap-2">
            <div className="size-4 rounded-xs bg-linear-to-br from-rose-600 to-red-700"></div>
            <p className="min-w-0 flex-1 truncate">{app.name}</p>
          </div>
          <p className="w-2/5 flex-auto truncate">{app.homepageUrl}</p>
          <p className="w-1/5 flex-auto truncate">
            {dayjs(app.createdAt).fromNow()}
          </p>
        </Link>
      ))}

      <NewAppDialog handle={newAppDialog} />
    </>
  );
}
