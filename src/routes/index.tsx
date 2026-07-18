import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold">Hello world!</h1>
      <p className="mt-2">This is a new TanStack Start app.</p>
    </div>
  );
}
