import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { verifySignupOtp } from "#/actions/auth/signup";
import { verifySignupOtpSchema } from "#/actions/auth/signup/schemas";
import logo from "#/assets/logos/youthacks-logo.svg";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/auth/signup/$id/otp")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: verifySignupOtp,
  });

  const form = useAppForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onChange: verifySignupOtpSchema,
    },

    onSubmit: async ({ value }) => {
      const result = await mutateAsync({ data: value });

      await navigate({ to: "/auth/signup/$id/terms" });
    },
  });

  return (
    <div className="p-8">
      <img src={logo} alt="" className="mb-4 h-8" />
      <h1 className="font-heading text-3xl font-bold">Verify your email</h1>
      <p className="mt-1 text-neutral-600">
        Enter the code we just sent to your email,
      </p>

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
          <form.SubmitButton size="lg" className="w-full">
            Next
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
