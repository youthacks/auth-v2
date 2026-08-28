import { useClipboard } from "@mantine/hooks";
import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import {
  getOAuthConfigQuery,
  updateOAuthConfigMutation,
} from "#/actions/apps/oauth/queries";
import { appOAuthSchema } from "#/actions/apps/oauth/schemas";
import { orpc } from "#/api/client";
import { updateOAuthSchema } from "#/api/routers/apps/schemas";
import FormMessage from "#/components/form/FormMessage";
import Button from "#/components/ui/Button";
import { Field } from "#/components/ui/Field";
import { Fieldset } from "#/components/ui/Fieldset";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/console/manage/apps/$id/oauth")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      getOAuthConfigQuery({ id: params.id }),
    );
  },
  component: RouteComponent,
});

function CopyField({
  label,
  value,
  hidden,
}: {
  label: string;
  value: string;
  hidden?: boolean;
}) {
  const clipboard = useClipboard({ timeout: 2000 });
  const [showValue, setShowValue] = useState(!hidden);

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <div className="relative">
        <Field.Control
          value={showValue ? value : ""}
          placeholder={hidden ? "•".repeat(64) : undefined}
          className={clsx("truncate font-mono", hidden ? "pr-18" : "pr-10")}
          disabled
        />
        <div className="absolute inset-y-0 right-0 flex gap-0.5 p-1.5">
          {hidden && (
            <button
              type="button"
              onClick={() => setShowValue((prev) => !prev)}
              className="grid size-7 place-items-center rounded-sm text-neutral-600 transition hover:bg-neutral-200"
            >
              {showValue ? (
                <>
                  <span className="sr-only">Hide</span>
                  <EyeOffIcon className="size-3.5" />
                </>
              ) : (
                <>
                  <span className="sr-only">View</span>
                  <EyeIcon className="size-3.5" />
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => clipboard.copy(value)}
            className="grid size-7 place-items-center rounded-sm text-neutral-600 transition hover:bg-neutral-200"
          >
            {clipboard.copied ? (
              <>
                <span className="sr-only">Copied</span>
                <CheckIcon className="size-3.5 text-rose-700" />
              </>
            ) : (
              <>
                <span className="sr-only">Copy</span>
                <CopyIcon className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </Field.Root>
  );
}

function RouteComponent() {
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(getOAuthConfigQuery({ id: params.id }));

  const { mutateAsync, isPending, error } = useMutation({
    ...updateOAuthConfigMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["apps", params.id, "oauth"],
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      allowedCallbackUrls: data.allowedCallbackUrls.join("\n"),
    },
    validators: {
      onDynamic: appOAuthSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: async ({ value, formApi }) => {
      try {
        await mutateAsync({ ...value, id: params.id });
        formApi.reset(value);
      } catch (_e) {}
    },
  });

  return (
    <div className="space-y-8 p-8">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-8 rounded-xl border border-neutral-200 p-6"
      >
        {error && <FormMessage state="error">{error.message}</FormMessage>}
        <Fieldset.Root>
          <Fieldset.Legend>Configuration</Fieldset.Legend>
          <CopyField label="Client ID" value={data.clientId} />
          <CopyField label="Client secret" value={data.clientSecret} hidden />
          <CopyField
            label="Discovery URL"
            value={"https://example.com/.well-known/openid-configuration"}
          />
          <CopyField
            label="Authorization URL"
            value={"https://example.com/oauth/authorize"}
          />
          <CopyField
            label="Token exchange URL"
            value={"https://example.com/oauth/token"}
          />
          <CopyField
            label="User info URL"
            value={"https://example.com/oauth/userinfo"}
          />
          <p className="text-sm font-semibold text-rose-700">Get started →</p>
        </Fieldset.Root>
        <hr className="border-neutral-200" />
        <Fieldset.Root>
          <Fieldset.Legend>Login settings</Fieldset.Legend>
          <form.AppField name="allowedCallbackUrls">
            {(field) => (
              <field.TextareaField
                label="Allowed callback URLs"
                description="Allowed URLs for redirecting users to after they've logged in. One per line, either https:// or http://localhost."
              />
            )}
          </form.AppField>
        </Fieldset.Root>

        <form.AppForm>
          <form.StatusBar disabled={isPending} />
        </form.AppForm>
      </form>

      <section>
        <h2 className="font-heading text-xl font-bold">Danger zone</h2>
        <p className="mt-0.5 text-sm text-neutral-600">
          These actions will break existing integrations.
        </p>
        <div className="mt-3 flex gap-3 opacity-50">
          <Button size="sm">Disable login</Button>
          <Button size="sm" color="danger">
            Rotate client secret
          </Button>
          <Button size="sm" color="danger">
            Remove login
          </Button>
        </div>
      </section>
    </div>
  );
}
