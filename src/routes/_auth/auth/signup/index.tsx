import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import z from "zod";

import { createSignup } from "#/actions/auth/signup";
import { createSignupSchema } from "#/actions/auth/signup/schemas";
import FormMessage from "#/components/form/FormMessage";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/_auth/auth/signup/")({
  validateSearch: z.object({
    email: z.email(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { mutate, isPending, error } = useMutation({
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
      <Link
        to="/auth"
        className="mb-6 flex max-w-fit items-center gap-1.5 text-neutral-600 underline-offset-2 transition hover:text-neutral-900 hover:underline"
      >
        <ArrowLeftIcon strokeWidth={2.5} className="size-4" />
        <span className="text-sm leading-none font-semibold">Back</span>
      </Link>

      <h1 className="font-heading text-3xl font-bold">Nice to meet you!</h1>
      <p className="mt-1 text-neutral-600">Tell us a little about yourself.</p>

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
