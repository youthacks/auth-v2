import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { listPublicAppsQuery } from "#/actions/apps/queries";
import { getConsentsQuery } from "#/actions/users/consents/queries";
import { getUserQuery } from "#/actions/users/queries";
import { DefaultAvatar } from "#/components/ui/Avatar";

export const Route = createFileRoute("/console/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(getUserQuery({ id: "me" }));
  const { data: consents } = useQuery(getConsentsQuery({ id: "me" }));
  const { data: publicApps } = useQuery(listPublicAppsQuery());

  const apps = useMemo(() => {
    if (!consents || !publicApps) return [];

    return [
      ...consents.map((c) => c.app),
      ...publicApps.filter((a) => !consents.some((c) => c.app.id === a.id)),
    ];
  }, [consents, publicApps]);

  const [date, setDate] = useState(() => dayjs());
  useEffect(() => {
    const interval = setInterval(() => setDate(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => {
    const hour = date.hour();
    if (hour < 5) return "Good night";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Good night";
  }, [date]);

  return (
    <div className="@container p-8">
      <h1 className="font-heading text-3xl font-bold">
        {greeting}, {user?.firstName}
      </h1>
      <p className="mt-0.5 text-neutral-600" suppressHydrationWarning={true}>
        it's {date.format("h:mm a")}
      </p>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold">Apps</h2>

        {apps ? (
          apps.length === 0 ? (
            <div className="mt-4 flex min-h-24 flex-col justify-center rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center">
              <p className="font-medium">No apps yet</p>
              <p className="text-sm text-neutral-600">
                Go sign in to something, then check back here!
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4">
              {apps.map((app) => (
                <a
                  key={app.id}
                  href={app.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-24 flex-col items-center justify-center rounded-lg border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95"
                >
                  <div className="mt-1 size-8 flex-none overflow-clip rounded-sm border border-neutral-200">
                    {app.logo ? (
                      <img
                        src={app.logo.url}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar>{app.name[0]}</DefaultAvatar>
                    )}
                  </div>
                  <p className="mt-2 text-sm">{app.name}</p>
                </a>
              ))}
            </div>
          )
        ) : (
          <div className="mt-4 grid auto-rows-0 grid-cols-3 grid-rows-1 gap-x-4 overflow-y-clip mask-b-from-0 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: intentional
                key={i}
                className="h-24 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100"
              ></div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
