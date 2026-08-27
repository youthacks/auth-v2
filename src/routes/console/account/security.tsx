import { Accordion } from "@base-ui/react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
  ChevronDownIcon,
  KeyIcon,
  MailIcon,
  RectangleEllipsisIcon,
} from "lucide-react";
import { orpc } from "#/api/client";
import Button from "#/components/ui/Button";
import { Fieldset } from "#/components/ui/Fieldset";
import { getSessionName, SessionIcon } from "#/lib/userAgent";

export const Route = createFileRoute("/console/account/security")({
  component: RouteComponent,
});

function Sessions() {
  const queryClient = useQueryClient();

  const { data: sessions } = useQuery(
    orpc.users.me.sessions.get.queryOptions(),
  );
  const { mutate, isPending } = useMutation(
    orpc.users.sessions.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.users.me.sessions.key(),
        });
      },
    }),
  );

  return (
    <section>
      <h2 className="font-heading text-xl font-bold">Sessions</h2>
      <Accordion.Root className="mt-3 divide-y divide-neutral-200 overflow-clip rounded-lg border border-neutral-200">
        <div className="flex gap-4 bg-neutral-100 px-4 py-1.5 text-sm">
          <p className="min-w-0 flex-1 truncate font-medium">Device</p>
          <p className="w-48 flex-none truncate font-medium">Created at</p>
          <div className="w-4 flex-none"></div>
        </div>
        {sessions ? (
          sessions.map((session) => (
            <Accordion.Item key={session.id}>
              <Accordion.Header className="group data-open:bg-neutral-100">
                <Accordion.Trigger className="flex h-16 w-full items-center gap-4 px-4 text-left transition hover:bg-neutral-100">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <SessionIcon userAgent={session.userAgent} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {getSessionName(session.userAgent)}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {session.isCurrent && (
                          <>
                            <span className="font-medium text-rose-700">
                              Current
                            </span>
                            <span className="mx-1">&middot;</span>
                          </>
                        )}
                        1.2.3.4
                      </p>
                    </div>
                  </div>
                  <p
                    title={dayjs(session.createdAt).toString()}
                    className="w-48 flex-none truncate text-sm underline decoration-dotted underline-offset-2"
                  >
                    {dayjs(session.createdAt).fromNow()}
                  </p>
                  <ChevronDownIcon className="size-4 text-neutral-600 transition group-data-open:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden bg-neutral-100 transition-[height] data-ending-style:h-0 data-starting-style:h-0">
                <div className="px-4 pb-4">
                  <hr className="mb-4 border-neutral-200" />

                  <Button
                    size="sm"
                    color="danger"
                    disabled={session.isCurrent || isPending}
                    onClick={() => {
                      mutate({ sessionId: session.id });
                    }}
                    className="mt-4"
                  >
                    Logout session
                  </Button>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))
        ) : (
          <div className="flex h-16 w-full items-center gap-4 px-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="size-8 animate-pulse rounded-sm bg-neutral-200"></div>
              <div className="min-w-0 flex-1">
                <div className="h-4 max-w-48 animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="mt-1 h-3 max-w-20 animate-pulse rounded-sm bg-neutral-200"></div>
              </div>
            </div>
            <div className="w-48 flex-none">
              <div className="h-4 w-24 animate-pulse rounded-sm bg-neutral-200"></div>
            </div>
            <div className="w-4 flex-none"></div>
          </div>
        )}
      </Accordion.Root>
    </section>
  );
}

function RouteComponent() {
  const { data: user } = useSuspenseQuery(orpc.users.me.get.queryOptions());

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col gap-8 rounded-xl border border-neutral-200 p-6">
        <Fieldset.Root className="gap-y-0!">
          <Fieldset.Legend>Log-in settings</Fieldset.Legend>
          <div className="flex h-8 items-center gap-3 *:opacity-50">
            <div className="grid size-8 place-items-center rounded-sm border border-neutral-200 bg-neutral-100">
              <MailIcon className="size-4 text-neutral-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Email</p>
              <p className="mt-px text-xs text-neutral-600">{user?.email}</p>
            </div>
            <div className="flex flex-none items-center gap-0.5">
              <Button size="sm">Change</Button>
            </div>
          </div>
          <hr className="my-4 border-neutral-200" />
          <div className="flex h-8 items-center gap-3 *:opacity-50">
            <div className="grid size-8 place-items-center rounded-sm border border-neutral-200 bg-neutral-100">
              <RectangleEllipsisIcon className="size-4 text-neutral-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Password</p>
              <p className="mt-px text-xs text-neutral-600">not set</p>
            </div>
            <div className="flex flex-none items-center gap-0.5">
              <Button size="sm">Add</Button>
            </div>
          </div>
          <hr className="my-4 border-neutral-200" />
          <div className="flex h-8 items-center gap-3 *:opacity-50">
            <div className="grid size-8 place-items-center rounded-sm border border-neutral-200 bg-neutral-100">
              <KeyIcon className="size-4 text-neutral-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Passkeys</p>
              <p className="mt-px text-xs text-neutral-600">3 added</p>
            </div>
            <div className="flex flex-none items-center gap-0.5">
              <Button size="sm">Manage</Button>
            </div>
          </div>
        </Fieldset.Root>
        <hr className="border-neutral-200" />
        <Fieldset.Root>
          <Fieldset.Legend>Two-factor authentication</Fieldset.Legend>
          <div className="rounded-lg border-2 border-dashed border-neutral-300 p-4">
            <p className="font-medium">2FA is not set up</p>
            <p className="mt-0.5 text-sm text-neutral-600">
              Verify it's you with an authenticator app or Yubikey, before
              logging in or making changes to your account.
            </p>
            <Button color="primary" size="sm" className="mt-4">
              Enable 2FA
            </Button>
          </div>
        </Fieldset.Root>
      </div>

      <Sessions />
    </div>
  );
}
