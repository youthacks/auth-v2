import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  EllipsisVerticalIcon,
  GlobeIcon,
  KeyIcon,
  MailIcon,
  RectangleEllipsisIcon,
} from "lucide-react";
import { orpc } from "#/api/client";
import Button from "#/components/ui/Button";

export const Route = createFileRoute("/console/account/security")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(orpc.users.me.get.queryOptions());

  return (
    <div className="p-8">
      <div className="space-y-8">
        <section>
          <h2 className="font-heading text-xl font-bold">Log-in</h2>
          <p className="mt-0.5 text-sm text-neutral-600">
            How you access your account.
          </p>
          <div className="mt-3 divide-y divide-neutral-300 border-y border-neutral-300">
            <div className="flex h-16 items-center gap-3 *:opacity-50">
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
            <div className="flex h-16 items-center gap-3 *:opacity-50">
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
            <div className="flex h-16 items-center gap-3 *:opacity-50">
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
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold">
            Two-factor authentication
          </h2>
          <p className="mt-0.5 text-sm text-neutral-600">
            An extra layer of security for your account.
          </p>

          <div className="mt-4 rounded-md border-2 border-dashed border-neutral-300 p-4 text-center">
            <p className="font-medium">2FA is not set up</p>
            <p className="mt-0.5 text-sm text-neutral-600">
              Verify it's you with an authenticator app or Yubikey, before
              logging in or making changes to your account.
            </p>
            <Button color="primary" size="sm" className="mx-auto mt-4">
              Enable 2FA
            </Button>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold">Sessions</h2>
          <p className="mt-0.5 text-sm text-neutral-600">
            All devices where you're logged in.
          </p>

          <div className="mt-3 divide-y divide-neutral-300 border-y border-neutral-300">
            <div className="flex h-16 items-center gap-3 *:opacity-50">
              <div className="grid size-8 place-items-center rounded-sm border border-neutral-200 bg-neutral-100">
                <GlobeIcon className="size-4 text-neutral-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Chrome on Windows 11</p>
                <p className="mt-px text-xs text-neutral-600">
                  London, UK &middot; last login 2 days ago
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
              <div className="grid size-8 place-items-center rounded-sm border border-neutral-200 bg-neutral-100">
                <GlobeIcon className="size-4 text-neutral-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Firefox on Windows 11</p>
                <p className="mt-px text-xs text-neutral-600">
                  London, UK &middot; last login 2 days ago
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
