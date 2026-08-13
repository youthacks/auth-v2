import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { verifyLoginOtp } from "#/actions/auth/login";
import { getLoginQuery } from "#/actions/auth/login/queries";
import { verifyLoginOtpSchema } from "#/actions/auth/login/schemas";
import { FormHeader } from "#/components/form/FormHeader";
import FormMessage from "#/components/form/FormMessage";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/_auth/auth/login/$id/otp")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(getLoginQuery({ id: params.id }));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data: login } = useSuspenseQuery(getLoginQuery({ id: params.id }));

  const { mutate, isPending, error } = useMutation({
    mutationFn: verifyLoginOtp,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["auth", "session"] });
      await navigate({ to: "/auth/finish" });
    },
  });

  const form = useAppForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onChange: verifyLoginOtpSchema,
    },

    onSubmit: ({ value }) =>
      mutate({ data: { otp: value.otp, id: params.id } }),
  });

  return (
    <div className="p-8">
      <FormHeader
        firstName={login.firstName}
        onLogout={() => navigate({ to: "/auth" })}
      />
      <h1 className="font-heading text-3xl font-bold">Verify your email</h1>
      <p className="mt-1 text-neutral-600">
        Enter the code we just sent to your email,
      </p>

      {error && (
        <FormMessage state="error" className="mt-6">
          {error.message}
        </FormMessage>
      )}

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-6 space-y-4"
      >
        <form.AppField name="otp">
          {(field) => (
            <field.OTPField
              label="One-time code"
              length={6}
              hideError
              autoFocus
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton disabled={isPending} size="lg" className="w-full">
            Next
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
