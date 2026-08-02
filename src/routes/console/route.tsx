import {
  createFileRoute,
  createLink,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import logo from "#/assets/logos/youthacks-logo.svg";
import ConsoleNavItem from "#/components/console/ConsoleNavItem";
import { HomeIcon, NotebookTextIcon, UserCircle2Icon } from "lucide-react";
import ConsoleUserDropdown from "#/components/console/ConsoleUserDropdown";

const ConsoleNavLink = createLink(ConsoleNavItem);

export const Route = createFileRoute("/console")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: context.user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full bg-neutral-100">
      <div className="flex-1"></div>
      <div className="flex w-full max-w-7xl flex-none">
        <div className="flex h-full w-80 flex-col justify-between gap-8 overflow-y-auto border-r border-neutral-300 p-8">
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
          </div>

          <ConsoleUserDropdown />
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto bg-white">
          <Outlet />
        </div>
      </div>
      <div className="flex-1 bg-white"></div>
    </div>
  );
}
