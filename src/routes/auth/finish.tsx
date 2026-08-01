import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { logout } from "#/actions/auth/session";
import { getCurrentUserQuery } from "#/actions/auth/session/queries";
import { FormHeader } from "#/components/form/FormHeader";
import Button from "#/components/ui/Button";

export const Route = createFileRoute("/auth/finish")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(getCurrentUserQuery());

  const { mutate: onLogout, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["auth", "session"] });
      await navigate({ to: "/auth", search: { exit: true } });
    },
  });

  return (
    <div className="p-8">
      {user && <FormHeader firstName={user.firstName} onLogout={onLogout} />}

      <h1 className="font-heading text-3xl font-bold">You're signed in</h1>
      <p className="mt-1.5 text-neutral-600 italic">
        Later, this is where you would be redirected to the dashboard. For now,
        it's just a finish screen{" "}
        <span className="ml-0.5 inline-block -translate-y-1">._.</span>
      </p>

      <Button
        onClick={() => onLogout()}
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
