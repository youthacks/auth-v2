import { Accordion } from "@base-ui/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import {
  deleteConsentMutation,
  getConsentsQuery,
} from "#/actions/users/consents/queries";
import Button from "#/components/ui/Button";

export const Route = createFileRoute("/console/account/apps")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getConsentsQuery({ id: "me" }));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: apps } = useSuspenseQuery(getConsentsQuery({ id: "me" }));
  const { mutate, isPending } = useMutation({
    ...deleteConsentMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users", "me", "consents"],
      });
    },
  });

  return (
    <div className="p-8">
      {apps.length === 0 ? (
        <div className="bder-2 rounded-lg border-dashed border-neutral-300 p-4 text-center">
          <p className="font-medium">No apps yet</p>
          <p className="text-sm text-neutral-600">
            Go sign in to something, then check back here!
          </p>
        </div>
      ) : (
        <Accordion.Root className="divide-y divide-neutral-200 overflow-clip rounded-lg border border-neutral-200">
          <div className="flex gap-4 bg-neutral-100 px-4 py-1.5 text-sm">
            <p className="min-w-0 flex-1 truncate font-medium">Name</p>
            <p className="w-48 flex-none truncate font-medium">Linked at</p>
            <div className="w-4 flex-none"></div>
          </div>
          {apps.map((appConsent) => (
            <Accordion.Item key={appConsent.appId}>
              <Accordion.Header className="group data-open:bg-neutral-100">
                <Accordion.Trigger className="flex h-16 w-full items-center gap-4 px-4 text-left transition hover:bg-neutral-100">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-linear-to-br from-rose-600 to-red-700"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {appConsent.app.name}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {appConsent.app.homepageUrl}
                      </p>
                    </div>
                  </div>
                  <p
                    title={dayjs(appConsent.createdAt).toString()}
                    className="w-48 flex-none truncate text-sm underline decoration-dotted underline-offset-2"
                  >
                    {dayjs(appConsent.createdAt).fromNow()}
                  </p>
                  <ChevronDownIcon className="size-4 text-neutral-600 transition group-data-open:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden bg-neutral-100 transition-[height] data-ending-style:h-0 data-starting-style:h-0">
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
                      <p className="w-32 text-sm font-medium">Permissions</p>
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
                      mutate({
                        id: appConsent.userId,
                        appId: appConsent.appId,
                      });
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
    </div>
  );
}
