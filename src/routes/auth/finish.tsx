import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUserQuery } from "#/actions/auth/session/queries";
import Button from "#/components/ui/Button";
import { logout } from "#/actions/auth/session";

export const Route = createFileRoute("/auth/finish")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(getCurrentUserQuery());
  const { mutate, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      await navigate({ to: "/auth", search: { exit: true } });
    },
  });

  return (
    <div className="p-8">
      {user && (
        <div className="mb-6 flex items-center gap-2">
          <span className="size-5 rounded-full bg-linear-to-br from-rose-600 to-red-600"></span>
          <span className="text-sm leading-none">{user.firstName}</span>
          <div className="flex-1"></div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => mutate()}
            className="text-sm leading-none font-semibold text-rose-700 underline-offset-2 hover:underline disabled:text-neutral-300 disabled:no-underline"
          >
            Not you?
          </button>
        </div>
      )}
      <h1 className="font-heading text-3xl font-bold">You're signed in</h1>
      <p className="mt-1.5 text-neutral-600 italic">
        Later, this is where you would be redirected to the dashboard. For now,
        it's just a finish screen{" "}
        <span className="ml-0.5 inline-block -translate-y-1">._.</span>
      </p>

      <Button
        onClick={() => mutate()}
        disabled={isPending}
        className="mt-6 w-full"
        size="lg"
        color="primary"
      >
        Logout
      </Button>
    </div>
  );
}
