import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  createLink,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import {
  HomeIcon,
  LayoutGridIcon,
  NotebookTextIcon,
  UserCircle2Icon,
  Users2Icon,
} from "lucide-react";
import { getUserQuery } from "#/actions/users/queries";
import logo from "#/assets/logos/youthacks-logo.svg";
import ConsoleNavItem from "#/components/console/ConsoleNavItem";
import ConsoleUserDropdown from "#/components/console/ConsoleUserDropdown";

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

  return (
    <div className="flex h-full bg-neutral-100">
      <div className="min-w-0 flex-1"></div>
      <div className="flex w-full max-w-7xl flex-none">
        <div className="flex h-full w-80 flex-col justify-between gap-8 overflow-y-auto border-r border-neutral-200 p-8">
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
        <div className="min-w-0 flex-1 overflow-y-auto bg-white">
          <Outlet />
        </div>
      </div>
      <div className="min-w-0 flex-1 bg-white"></div>
    </div>
  );
}
