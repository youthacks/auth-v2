import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { orpc } from "#/api/client";

export const Route = createFileRoute("/console/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(orpc.users.me.get.queryOptions());

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
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold">
        {greeting}, {user?.firstName}
      </h1>
      <p className="mt-0.5 text-neutral-600">it's {date.format("h:mm a")}</p>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold">Apps</h2>
        <div className="mt-4 rounded-md border-2 border-dashed border-neutral-300 p-4 text-center">
          <p className="font-medium">No apps</p>
          <p className="text-sm text-neutral-600">
            Go sign in to something, then check back here!
          </p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95">
            <div className="size-8 rounded-sm bg-linear-to-br from-rose-600 to-red-700"></div>
            <p className="mt-2 text-sm">Red app</p>
          </div>
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95">
            <div className="size-8 rounded-sm bg-linear-to-br from-orange-600 to-amber-700"></div>
            <p className="mt-2 text-sm">Orange app</p>
          </div>
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95">
            <div className="size-8 rounded-sm bg-linear-to-br from-yellow-600 to-yellow-700"></div>
            <p className="mt-2 text-sm">Yellow app</p>
          </div>
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95">
            <div className="size-8 rounded-sm bg-linear-to-br from-lime-600 to-green-700"></div>
            <p className="mt-2 text-sm">Green app</p>
          </div>
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95">
            <div className="size-8 rounded-sm bg-linear-to-br from-teal-600 to-cyan-700"></div>
            <p className="mt-2 text-sm">Teal app</p>
          </div>
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95">
            <div className="size-8 rounded-sm bg-linear-to-br from-sky-600 to-blue-700"></div>
            <p className="mt-2 text-sm">Blue app</p>
          </div>
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-gray-300 bg-white text-center shadow-xs transition hover:bg-neutral-100 active:scale-95">
            <div className="size-8 rounded-sm bg-linear-to-br from-indigo-600 to-violet-700"></div>
            <p className="mt-2 text-sm">Purple app</p>
          </div>
        </div>
      </section>
    </div>
  );
}
