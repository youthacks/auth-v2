import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  createLink,
  Outlet,
  redirect,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  HomeIcon,
  LayoutGridIcon,
  MenuIcon,
  NotebookTextIcon,
  UserCircle2Icon,
  Users2Icon,
  XIcon,
} from "lucide-react";
import { getUserQuery } from "#/actions/users/queries";
import logo from "#/assets/logos/youthacks-logo.svg";
import ConsoleNavItem from "#/components/console/ConsoleNavItem";
import ConsoleUserDropdown from "#/components/console/ConsoleUserDropdown";
import { useEffect, useState } from "react";
import clsx from "clsx";

const ConsoleNavLink = createLink(ConsoleNavItem);

export const Route = createFileRoute("/console")({
  beforeLoad: async ({ context, location }) => {
    const { session } = context;
    if (!session) {
      throw redirect({ to: "/auth", search: { return_to: location.pathname } });
    }

    const user = await context.queryClient.ensureQueryData(
      getUserQuery({ id: "me" }),
    );
    return { session, user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(getUserQuery({ id: "me" }));

  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = router.subscribe("onRendered", () => {
      setMenuOpen(false);
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex h-full overflow-x-clip bg-neutral-100">
      <div className="min-w-0 flex-1"></div>
      <div className="flex w-full max-w-7xl flex-none overflow-x-clip">
        <div
          className={clsx(
            "relative flex h-full w-full min-w-0 flex-none flex-col justify-between gap-8 overflow-y-auto border-r border-neutral-200 p-8 duration-300 ease-in-out-expo max-lg:transition lg:w-80",
            menuOpen ? "" : "max-lg:-translate-x-1/4",
          )}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 grid size-8 place-items-center rounded-lg transition hover:bg-neutral-200 lg:hidden"
          >
            <XIcon className="size-4" />
          </button>

          <div>
            <img src={logo} alt="" className="mb-4 h-6" />
            <div className="space-y-0.5">
              <ConsoleNavLink
                to="/console/home"
                activeProps={{ active: true }}
                icon={HomeIcon}
              >
                Home
              </ConsoleNavLink>
              <ConsoleNavLink
                to="/console/logbook"
                activeProps={{ active: true }}
                icon={NotebookTextIcon}
              >
                Logbook
              </ConsoleNavLink>
              <ConsoleNavLink
                to="/console/account"
                activeProps={{ active: true }}
                icon={UserCircle2Icon}
              >
                Account
              </ConsoleNavLink>
            </div>
            {user.role === "admin" && (
              <>
                <p className="mt-4 mb-1.5 text-sm font-semibold text-neutral-600">
                  Manage
                </p>
                <div className="space-y-0.5">
                  <ConsoleNavLink
                    to="/console/manage/users"
                    activeProps={{ active: true }}
                    icon={Users2Icon}
                  >
                    Users
                  </ConsoleNavLink>
                  <ConsoleNavLink
                    to="/console/manage/apps"
                    activeProps={{ active: true }}
                    icon={LayoutGridIcon}
                  >
                    Applications
                  </ConsoleNavLink>
                </div>
              </>
            )}
          </div>

          <ConsoleUserDropdown />
        </div>
        <div
          className={clsx(
            "w-full min-w-0 flex-none overflow-x-hidden overflow-y-auto bg-white duration-300 ease-in-out-expo max-lg:transition lg:flex-1",
            menuOpen ? "" : "max-lg:-translate-x-full",
          )}
        >
          <div className="relative -mb-4 px-6 pt-6 lg:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="grid size-8 place-items-center rounded-lg transition hover:bg-neutral-200"
            >
              <MenuIcon className="size-4" />
            </button>
          </div>
          <Outlet />
        </div>
      </div>
      <div className="min-w-0 flex-1 bg-white"></div>
    </div>
  );
}
