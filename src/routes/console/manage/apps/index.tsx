import Button from "#/components/ui/Button";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/console/manage/apps/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8">
      <div className="flex justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Applications</h1>
        <Button color="primary">
          <PlusIcon strokeWidth={2.5} className="size-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
