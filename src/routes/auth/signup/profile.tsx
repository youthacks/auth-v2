import { createFileRoute } from "@tanstack/react-router";
import logo from "#/assets/logos/youthacks-logo.svg";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/auth/signup/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      email: "joe.bloggs@example.com",
      firstName: "",
      lastName: "",
      displayName: "",
      dateOfBirth: "",
    },
  });

  return (
    <div className="p-8">
      <img src={logo} alt="" className="mb-4 h-8" />
      <h1 className="font-heading text-3xl font-bold">Nice to meet you!</h1>
      <p className="mt-1 text-neutral-600">Tell us a little about yourself.</p>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-6 space-y-4"
      >
        <form.AppField name="email">
          {(field) => (
            <field.TextField type="email" size="lg" label="Email" disabled />
          )}
        </form.AppField>
        <div className="flex gap-3">
          <form.AppField name="firstName">
            {(field) => (
              <field.TextField
                type="text"
                size="lg"
                label="First name"
                placeholder="Joe"
                autoComplete="given-name"
                autoFocus
              />
            )}
          </form.AppField>
          <form.AppField name="lastName">
            {(field) => (
              <field.TextField
                type="text"
                size="lg"
                label="Last name"
                placeholder="Bloggs"
                autoComplete="family-name"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="dateOfBirth">
          {(field) => (
            <field.TextField
              type="date"
              size="lg"
              label="Date of birth"
              autoComplete="bday"
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
