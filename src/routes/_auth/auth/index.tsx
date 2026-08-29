import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { KeyIcon } from "lucide-react";
import z from "zod";

import { discoverLogin } from "#/actions/auth/discovery";
import { discoverLoginSchema } from "#/actions/auth/discovery/schemas";

import logo from "#/assets/logos/youthacks-logo.svg";
import FormMessage from "#/components/form/FormMessage";
import Button from "#/components/ui/Button";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/_auth/auth/")({
  validateSearch: z.object({
    exit: z.boolean().optional().catch(undefined),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const { app } = useLoaderData({ from: "/_auth" });

  const { mutate, isPending, error, submittedAt } = useMutation({
    mutationFn: discoverLogin,
    onSuccess: async (result, { data: { email } }) => {
      if (result.type === "signup") {
        await navigate({ to: "/auth/signup", search: { email } });
      } else if (result.type === "login") {
        await navigate({
          to: "/auth/login/$id/otp",
          params: { id: result.id },
        });
      }
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onDynamic: discoverLoginSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: ({ value }) => mutate({ data: value }),
  });

  return (
    <div className="p-8">
      <img src={logo} alt="" className="mb-4 h-6" />
      <h1 className="font-heading text-3xl font-bold">Log in or sign up</h1>
      <p className="mt-1 text-neutral-600">
        to continue to{" "}
        {app ? (
          <span className="font-semibold text-black">{app.name}</span>
        ) : (
          "your account"
        )}
      </p>
      {/* <p className="mt-2 text-sm text-neutral-600">
        use signup@example.com, login@example.com, or login-org@example.com
      </p> */}

      {error && (
        <FormMessage state="error" className="mt-6">
          {error.message}
        </FormMessage>
      )}
      {search.exit && !submittedAt && (
        <FormMessage state="success" className="mt-6">
          You've logged out.
        </FormMessage>
      )}

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-6 space-y-4"
        noValidate
      >
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              type="email"
              size="lg"
              label="Email"
              placeholder="email@example.com"
              autoComplete="email"
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

      <Button className="mt-6 w-full" size="lg" color="outline">
        <KeyIcon strokeWidth={2.5} className="size-4" />
        <span>Log in with passkey</span>
      </Button>
    </div>
  );
}
