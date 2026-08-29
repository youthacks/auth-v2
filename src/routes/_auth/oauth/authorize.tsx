import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { NotebookTextIcon, User2Icon } from "lucide-react";
import { useMemo } from "react";
import {
  oauthAuthorize,
  oauthAuthorizeSilently,
  oauthGetAppInfo,
} from "#/actions/oauth";
import { oauthAuthorizeSchema } from "#/actions/oauth/schemas";
import { getUser } from "#/actions/users";
import { FormHeader } from "#/components/form/FormHeader";
import FormMessage from "#/components/form/FormMessage";
import { DefaultAvatar } from "#/components/ui/Avatar";
import Button from "#/components/ui/Button";

export const Route = createFileRoute("/_auth/oauth/authorize")({
  validateSearch: oauthAuthorizeSchema,
  beforeLoad: async ({ context, location }) => {
    if (!context.session) {
      const search = new URLSearchParams(location.search);
      throw redirect({
        to: "/auth",
        search: {
          return_to: `${location.pathname}?${search.toString()}`,
        },
      });
    }
    return { session: context.session };
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    const result = await oauthAuthorizeSilently({
      data: search,
    });
    if (result) {
      const newSearch = new URLSearchParams();
      newSearch.set("code", result.code);
      if (search.state) newSearch.set("state", search.state);

      throw redirect({
        href: `${search.redirect_uri}?${newSearch.toString()}`,
      });
    }

    const app = await oauthGetAppInfo({
      data: search,
    });
    const user = await getUser({ data: { id: "me" } });

    return { app, user };
  },
  component: RouteComponent,
});

function ProfileScopes({ scopes: requestedScopes }: { scopes: string[] }) {
  const scopes = ["openid", "profile", "email", "birthdate"];

  const viewText = useMemo(() => {
    const items = [
      requestedScopes.includes("profile") && "name",
      requestedScopes.includes("profile") && "profile picture",
      requestedScopes.includes("email") && "email",
      requestedScopes.includes("birthdate") && "date of birth",
    ].filter(Boolean);

    if (items.length <= 2) return items.join(" and ");

    return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
  }, [requestedScopes]);

  if (!requestedScopes.some((scope) => scopes.includes(scope))) return null;

  return (
    <div className="flex items-center gap-2">
      <User2Icon className="size-4" />
      <span>{viewText ? `View your ${viewText}` : "Identify you"}</span>
    </div>
  );
}

function RouteComponent() {
  const { app, user } = Route.useLoaderData();

  const search = Route.useSearch();
  const navigate = useNavigate();

  const scopes = useMemo(
    () => search.scope.split(/\s/).filter(Boolean),
    [search.scope],
  );

  const { isPending, error, mutate } = useMutation({
    mutationFn: oauthAuthorize,
    onSuccess: async (data) => {
      const newSearch = new URLSearchParams();
      newSearch.set("code", data.code);
      if (search.state) newSearch.set("state", search.state);

      navigate({
        href: `${search.redirect_uri}?${newSearch.toString()}`,
      });
      await new Promise(() => {}); // wait for navigation to finish
    },
  });

  return (
    <div className="p-8">
      <FormHeader
        firstName={user.firstName}
        avatarUrl={user.avatar?.url}
        onLogout={() => navigate({ to: "/auth" })}
      />
      <div className="flex justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Authorise app</h1>
          <p className="mt-1 text-neutral-600">
            <span className="font-semibold text-black">{app.name}</span> by{" "}
            {app.owner.firstName}
          </p>
        </div>
        <div className="mt-1 size-12 flex-none overflow-clip rounded-sm border border-neutral-200">
          {app.logo ? (
            <img src={app.logo.url} alt="" className="size-full object-cover" />
          ) : (
            <DefaultAvatar>{app.name[0]}</DefaultAvatar>
          )}
        </div>
      </div>

      {error && (
        <FormMessage state="error" className="mt-6">
          {error.message}
        </FormMessage>
      )}

      <p className="mt-6">If you allow, this app will be able to:</p>
      <div className="mt-3 space-y-3 rounded-lg border border-neutral-300 p-3 px-4 text-neutral-600 shadow-xs">
        <ProfileScopes scopes={scopes} />
        {/*<div className="flex items-center gap-2">
          <NotebookTextIcon className="size-4" />
          <span>Add events to your logbook</span>
        </div>*/}
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
        <Button
          size="lg"
          color="primary"
          disabled={isPending}
          onClick={() => mutate({ data: { ...search, consent: true } })}
        >
          Allow
        </Button>
      </div>
    </div>
  );
}
