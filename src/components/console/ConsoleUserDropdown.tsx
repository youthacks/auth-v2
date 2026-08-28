import { Menu } from "@base-ui/react/menu";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronUpIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { logout } from "#/actions/auth/session";
import { getUserQuery } from "#/actions/users/queries";

export default function ConsoleUserDropdown() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(getUserQuery({ id: "me" }));
  const { mutate, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.removeQueries();
      await navigate({ to: "/auth" });
    },
  });

  return (
    <Menu.Root>
      <Menu.Trigger className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-neutral-200 data-popup-open:bg-neutral-200">
        <div className="size-8 flex-none overflow-clip rounded-full">
          {user.avatar ? (
            <img
              src={user.avatar.url}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-linear-to-br from-blue-600 to-indigo-700"></div>
          )}
        </div>
        <div className="w-full min-w-0">
          <p className="text-sm font-medium">{user.firstName}</p>
          <p className="text-xs text-neutral-600">{user.email}</p>
        </div>
        <ChevronUpIcon className="size-4 flex-none text-neutral-600 transition-transform group-data-popup-open:rotate-180" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" sideOffset={4}>
          <Menu.Popup className="w-(--anchor-width) origin-bottom overflow-clip rounded-lg border border-neutral-200 bg-white shadow-xs transition data-ending-style:scale-y-95 data-ending-style:opacity-0 data-starting-style:scale-y-95 data-starting-style:opacity-0">
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
