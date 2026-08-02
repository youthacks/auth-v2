import { createFileRoute } from "@tanstack/react-router";
import { EllipsisVerticalIcon } from "lucide-react";

export const Route = createFileRoute("/console/account/apps")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8">
      <div className="space-y-8">
        <section>
          <h2 className="font-heading text-xl font-bold">Authorised apps</h2>
          <p className="mt-0.5 text-sm text-neutral-600">
            All the apps you've logged into before.
          </p>
          <div className="mt-3 divide-y divide-neutral-300 border-y border-neutral-300">
            <div className="flex h-16 items-center gap-3 *:opacity-50">
              <div className="size-8 rounded-sm bg-linear-to-br from-rose-600 to-red-700"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Red app</p>
                <p className="mt-px text-xs text-neutral-600">
                  last login 2 days ago
                </p>
              </div>
              <button
                type="button"
                className="grid size-6 place-items-center rounded-sm hover:bg-neutral-200"
              >
                <EllipsisVerticalIcon className="size-3 text-neutral-600" />
              </button>
            </div>
            <div className="flex h-16 items-center gap-3 *:opacity-50">
              <div className="size-8 rounded-sm bg-linear-to-br from-lime-600 to-green-700"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Green app</p>
                <p className="mt-px text-xs text-neutral-600">
                  last login 3 weeks ago
                </p>
              </div>
              <button
                type="button"
                className="grid size-6 place-items-center rounded-sm hover:bg-neutral-200"
              >
                <EllipsisVerticalIcon className="size-3 text-neutral-600" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
