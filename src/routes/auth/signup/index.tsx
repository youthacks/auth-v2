import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import { createSignup } from "#/actions/auth/signup";
import { createSignupSchema } from "#/actions/auth/signup/schemas";
import logo from "#/assets/logos/youthacks-logo.svg";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/auth/signup/")({
  validateSearch: z.object({
    email: z.email(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { mutate, isPending } = useMutation({
    mutationFn: createSignup,
    onSuccess: async (result) => {
      await navigate({ to: "/auth/signup/$id/otp", params: { id: result.id } });
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: search.email,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
    },
    validators: {
      onDynamic: createSignupSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: ({ value }) => mutate({ data: value }),
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
          <form.SubmitButton disabled={isPending} size="lg" className="w-full">
            Next
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
