import { Menu } from "@base-ui/react/menu";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronUpIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { logout } from "#/actions/auth/session";
import { getCurrentUserQuery } from "#/actions/auth/session/queries";

export default function ConsoleUserDropdown() {
  const { data: user } = useSuspenseQuery(getCurrentUserQuery());
  const { mutate, isPending } = useMutation({
    mutationFn: () => logout(),
  });

  return (
    <Menu.Root>
      <Menu.Trigger className="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition-colors hover:bg-neutral-200 data-popup-open:bg-neutral-200">
        <span className="size-8 flex-none rounded-full bg-linear-to-br from-blue-600 to-indigo-700"></span>
        <div className="w-full min-w-0">
          <p className="text-sm font-medium">{user?.firstName}</p>
          <p className="text-xs text-neutral-600">{user?.email}</p>
        </div>
        <ChevronUpIcon className="size-4 flex-none text-neutral-600 transition-transform group-data-popup-open:rotate-180" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" sideOffset={4}>
          <Menu.Popup className="w-(--anchor-width) origin-bottom overflow-clip rounded-md border border-neutral-300 bg-white shadow-xs transition data-ending-style:scale-y-95 data-ending-style:opacity-0 data-starting-style:scale-y-95 data-starting-style:opacity-0">
            <div className="p-1">
              <Menu.LinkItem
                render={<Link to="/console/account" />}
                closeOnClick
                className="flex h-8 w-full items-center gap-1.5 rounded-sm px-2 text-left transition-colors data-highlighted:bg-neutral-200"
              >
                <SettingsIcon className="size-4 text-neutral-600" />
                <span className="text-sm">Account settings</span>
              </Menu.LinkItem>
              <Menu.Item
                onClick={() => mutate()}
                disabled={isPending}
                className="flex h-8 w-full cursor-default items-center gap-1.5 rounded-sm px-2 text-left text-rose-700 transition-colors data-disabled:bg-transparent! data-disabled:text-neutral-500! data-highlighted:bg-rose-200 data-highlighted:text-rose-800"
              >
                <LogOutIcon className="size-4" />
                <span className="text-sm">Logout</span>
              </Menu.Item>
            </div>
            <p className="px-3 pb-2 text-xs text-neutral-400">
              auth version aabb123
            </p>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
