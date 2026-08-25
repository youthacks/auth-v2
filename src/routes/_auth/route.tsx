import { createFileRoute, Outlet } from "@tanstack/react-router";
import background from "#/assets/backgrounds/coolashack5.jpg";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <img
        src={background}
        className="fixed inset-0 -z-10 h-full w-full object-cover"
        alt="Background"
      />
      <div className="flex size-full flex-col items-center gap-4 overflow-auto p-8">
        <div className="mx-auto w-full max-w-lg overflow-clip rounded-xl border border-neutral-200 bg-white shadow-md">
          <Outlet />
        </div>

        <div className="flex-1"></div>

        <div className="rounded-full bg-black/50 px-3 py-2 backdrop-blur-md">
          <p className="text-xs text-white/80">
            auth version aabb123
            <span className="mx-1.5 text-white/50">&middot;</span>
            Cool as Hack, 2025, Cambridge
          </p>
        </div>
      </div>
    </>
  );
}
