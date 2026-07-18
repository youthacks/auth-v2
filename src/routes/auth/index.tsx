import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { KeyIcon } from "lucide-react";

import { discoverLogin } from "#/actions/auth/discovery";
import { discoverLoginSchema } from "#/actions/auth/discovery/schemas";

import logo from "#/assets/logos/youthacks-logo.svg";
import Button from "#/components/ui/Button";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: discoverLogin,
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onDynamic: discoverLoginSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: async ({ value }) => {
      const result = await mutateAsync({ data: value });

      if (result.type === "signup") {
        await navigate({ to: "/auth/signup" });
      } else {
        // redirect to login page
      }
    },
  });

  return (
    <div className="p-8">
      <img src={logo} alt="" className="mb-4 h-8" />
      <h1 className="font-heading text-3xl font-bold">Log in or sign up</h1>
      <p className="mt-1 text-neutral-600">
        to continue to{" "}
        <span className="font-semibold text-black">Youthacks</span>
      </p>
      {/* <p className="mt-2 text-sm text-neutral-600">
        use signup@example.com, login@example.com, or login-org@example.com
      </p> */}

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
          <form.SubmitButton size="lg" className="w-full">
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
