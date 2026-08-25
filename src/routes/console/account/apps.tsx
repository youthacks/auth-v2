import { Accordion } from "@base-ui/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import { orpc } from "#/api/client";
import Button from "#/components/ui/Button";

export const Route = createFileRoute("/console/account/apps")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      orpc.users.me.consents.get.queryOptions(),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: apps } = useSuspenseQuery(
    orpc.users.me.consents.get.queryOptions(),
  );
  const { mutate, isPending } = useMutation(
    orpc.users.me.consents.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.users.me.consents.key(),
        });
      },
    }),
  );

  return (
    <div className="p-8">
      <div className="space-y-8">
        <section>
          <h2 className="font-heading text-xl font-bold">Authorised apps</h2>
          <p className="mt-0.5 text-sm text-neutral-600">
            All the apps you've logged into before.
          </p>
          {apps.length === 0 ? (
            <div className="mt-3 rounded-md border-2 border-dashed border-neutral-300 p-4 text-center">
              <p className="font-medium">No apps yet</p>
              <p className="text-sm text-neutral-600">
                Go sign in to something, then check back here!
              </p>
            </div>
          ) : (
            <Accordion.Root className="mt-3 space-y-2">
              {apps.map((appConsent) => (
                <Accordion.Item
                  key={appConsent.appId}
                  className="overflow-clip rounded-md border border-neutral-300 shadow-xs"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="flex h-16 w-full items-center gap-3 px-4 text-left transition hover:bg-neutral-100">
                      <div className="size-8 rounded-sm bg-linear-to-br from-rose-600 to-red-700"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {appConsent.app.name}
                        </p>
                        <p className="mt-px text-xs text-neutral-600">
                          first linked {dayjs(appConsent.createdAt).fromNow()}
                        </p>
                      </div>
                      <ChevronDownIcon className="size-4 text-neutral-600" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] data-ending-style:h-0 data-starting-style:h-0">
                    <div className="px-4 pb-4">
                      <hr className="mb-4 border-neutral-200" />
                      <div className="space-y-1">
                        <div className="flex">
                          <p className="w-32 text-sm font-medium">Homepage</p>
                          <a
                            href={appConsent.app.homepageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm font-medium text-rose-700 hover:text-rose-900 hover:underline"
                          >
                            {appConsent.app.homepageUrl}
                            <ArrowUpRightIcon
                              strokeWidth={2.5}
                              className="ml-1 inline-block size-3"
                            />
                          </a>
                        </div>
                        <div className="flex">
                          <p className="w-32 text-sm font-medium">
                            Permissions
                          </p>
                          <p className="text-sm text-neutral-600">
                            {appConsent.scopes}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        color="danger"
                        disabled={isPending}
                        onClick={() => {
                          mutate({ appId: appConsent.appId });
                        }}
                        className="mt-4"
                      >
                        Revoke access
                      </Button>
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          )}
        </section>
      </div>
    </div>
  );
}
