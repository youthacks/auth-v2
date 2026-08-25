import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/console/logbook")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold">Your logbook</h1>
      <div className="mt-6 space-y-6">
        <div className="rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center">
          <p className="font-medium">No entries yet</p>
          <p className="text-sm text-neutral-600">
            Go take part in something, then check back here to see all the cool
            things you made + learned!
          </p>
        </div>
        <section className="flex gap-6">
          <div className="flex-none pt-4 text-center text-neutral-600">
            <p className="text-lg leading-none">2</p>
            <p className="mt-px text-sm">Aug</p>
          </div>
          <div className="min-w-0 flex-1 rounded-lg border border-cyan-200 bg-cyan-100 p-6">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-xs bg-linear-to-br from-cyan-600 to-blue-700"></div>
              <p className="text-sm">Cyan app</p>
            </div>
            <p className="mt-2 text-lg font-semibold">Lorem Ipsum</p>
            <p className="mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              voluptatibus nesciunt laudantium illum exercitationem accusamus
              ipsa cupiditate reprehenderit nulla vero? Minus optio hic error
              illum reiciendis molestiae dolorum atque distinctio!
            </p>
            <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-sm text-neutral-600">Your project</p>
              <p className="font-semibold">Lorem Ipsum</p>
              <div className="mt-1 flex gap-2">
                <p className="text-sm font-semibold text-cyan-700">itch.io</p>
                <p className="text-sm font-semibold text-cyan-700">GitHub</p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex gap-6">
          <div className="flex-none pt-4 text-center text-neutral-600">
            <p className="text-lg leading-none">2</p>
            <p className="mt-px text-sm">Aug</p>
          </div>
          <div className="min-w-0 flex-1 rounded-lg border border-orange-200 bg-orange-100 p-6">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-xs bg-linear-to-br from-orange-600 to-yellow-700"></div>
              <p className="text-sm">Orange app</p>
            </div>
            <p className="mt-2 text-lg font-semibold">Lorem Ipsum</p>
            <p className="mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              voluptatibus nesciunt laudantium illum exercitationem accusamus
              ipsa cupiditate reprehenderit nulla vero? Minus optio hic error
              illum reiciendis molestiae dolorum atque distinctio!
            </p>
            <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-sm text-neutral-600">Your project</p>
              <p className="font-semibold">Lorem Ipsum</p>
              <div className="mt-1 flex gap-2">
                <p className="text-sm font-semibold text-orange-700">itch.io</p>
                <p className="text-sm font-semibold text-orange-700">GitHub</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
