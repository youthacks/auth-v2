import { createFileRoute } from "@tanstack/react-router";
import logo from "#/assets/logos/youthacks-logo.svg";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/auth/signup/otp")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      otp: "",
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
            <field.OTPField label="One-time code" length={6} autoFocus />
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
