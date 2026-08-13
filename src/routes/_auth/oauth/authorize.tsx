import { createFileRoute, redirect } from "@tanstack/react-router";
import { NotebookTextIcon, User2Icon } from "lucide-react";
import z from "zod";
import { FormHeader } from "#/components/form/FormHeader";
import Button from "#/components/ui/Button";

export const Route = createFileRoute("/_auth/oauth/authorize")({
  validateSearch: z.object({
    client_id: z.string(),
  }),
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      const search = new URLSearchParams(location.search);
      throw redirect({
        to: "/auth",
        search: {
          return_to: `${location.pathname}?${search.toString()}`,
        },
      });
    }
    return { user: context.user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="p-8">
      <FormHeader
        firstName={user.firstName}
        onLogout={() => navigate({ to: "/auth" })}
      />
      <div className="flex justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Authorise app</h1>
          <p className="mt-1 text-neutral-600">
            <span className="font-semibold text-black">Cool as Hack</span> by
            Joe
          </p>
        </div>
        <div className="mt-1 size-8 rounded-sm bg-linear-to-br from-rose-600 to-red-700"></div>
      </div>

      <p className="mt-6">If you allow, this app will be able to:</p>
      <div className="mt-3 space-y-3 rounded-md border border-neutral-300 bg-neutral-50 p-3 px-4 text-neutral-600 inset-shadow-xs">
        <div className="flex items-center gap-2">
          <User2Icon className="size-4" />
          <span>View your name, email and date of birth</span>
        </div>
        <div className="flex items-center gap-2">
          <NotebookTextIcon className="size-4" />
          <span>Add events to your logbook</span>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-xs leading-snug text-neutral-600">
        <p>
          You can revoke access at any time from your dashboard, by visiting{" "}
          <span className="whitespace-nowrap">'Account' → 'Your apps'</span>.
        </p>
        <p>
          As always, by logging in and using any Youthacks systems, you agree to
          our{" "}
          <span className="underline underline-offset-2 transition hover:text-neutral-800">
            Conditions of Use
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-2 transition hover:text-neutral-800">
            Privacy Policy
          </span>
          .
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button size="lg">Cancel</Button>
        <Button size="lg" color="primary">
          Allow
        </Button>
      </div>
    </div>
  );
}
