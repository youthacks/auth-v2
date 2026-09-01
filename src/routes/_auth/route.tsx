import {
  createFileRoute,
  Outlet,
  type ParsedLocation,
} from "@tanstack/react-router";
import { oauthGetAppInfo } from "#/actions/oauth";
import { oauthAuthorizeSchema } from "#/actions/oauth/schemas";

import coolashack1 from "#/assets/backgrounds/coolashack-1.jpg";
import coolashack4 from "#/assets/backgrounds/coolashack-4.jpg";
import coolashack5 from "#/assets/backgrounds/coolashack-5.jpg";
import coolashack7 from "#/assets/backgrounds/coolashack-7.jpg";
import daydreamLon2 from "#/assets/backgrounds/daydream-lon-2.jpg";
import daydreamLon6 from "#/assets/backgrounds/daydream-lon-6.jpg";
import daydreamLon7 from "#/assets/backgrounds/daydream-lon-7.jpg";
import daydreamLon8 from "#/assets/backgrounds/daydream-lon-8.jpg";

export const Route = createFileRoute("/_auth")({
  loader: async ({ location }) => {
    const background =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];

    const meta = getOAuthMetaFromLocation(location);
    if (meta) {
      const app = await oauthGetAppInfo({ data: meta });
      return { app, background };
    }

    return { background };
  },
  component: RouteComponent,
});

const backgrounds = [
  { url: coolashack1, caption: "Cool as Hack, Cambridge, 2025" },
  { url: coolashack4, caption: "Cool as Hack, Cambridge, 2025" },
  { url: coolashack5, caption: "Cool as Hack, Cambridge, 2025" },
  { url: coolashack7, caption: "Cool as Hack, Cambridge, 2025" },
  { url: daydreamLon2, caption: "Daydream London, 2025" },
  { url: daydreamLon6, caption: "Daydream London, 2025" },
  { url: daydreamLon7, caption: "Daydream London, 2025" },
  { url: daydreamLon8, caption: "Daydream London, 2025" },
] satisfies { url: string; caption: string }[];

function getOAuthMetaFromLocation(location: ParsedLocation) {
  if (location.pathname.startsWith("/oauth/authorize")) {
    const result = oauthAuthorizeSchema.safeParse(location.search);
    return result.data ?? null;
  }

  if (
    "return_to" in location.search &&
    typeof location.search.return_to === "string"
  ) {
    const returnToUrl = new URL(
      location.search.return_to,
      "https://example.com",
    );
    const searchParams = Object.fromEntries(returnToUrl.searchParams.entries());

    const result = oauthAuthorizeSchema.safeParse(searchParams);
    return result.data ?? null;
  }

  return null;
}

function RouteComponent() {
  const { app, background } = Route.useLoaderData();

  return (
    <>
      <div className="fixed inset-x-0 top-0 flex h-10 items-center justify-center-safe overflow-x-auto bg-amber-700 px-4 text-sm">
        <p className="flex-none text-white">
          This is{" "}
          <span className="font-semibold">not a production system.</span> You
          may wish not to enter your real name or personal information.
        </p>
      </div>
      <img
        src={app?.background?.url ?? background.url}
        className="animate-background-in fixed inset-0 -z-10 h-full w-full object-cover"
        alt=""
      />
      <div className="flex size-full flex-col items-center gap-4 overflow-auto p-4 pt-14 sm:p-8 sm:pt-18">
        <div className="mx-auto w-full overflow-clip rounded-xl border border-neutral-200 bg-white shadow-md sm:max-w-lg">
          <Outlet />
        </div>

        <div className="flex-1"></div>

        <div className="rounded-full bg-black/50 px-3 py-2 backdrop-blur-md">
          <p className="text-center text-xs text-white/80">
            {app ? app.name : background.caption}
          </p>
        </div>
      </div>
    </>
  );
}
