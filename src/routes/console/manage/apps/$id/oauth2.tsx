import { useClipboard } from "@mantine/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { getAppOAuth2ConfigQuery } from "#/actions/console/manage/apps/oauth2/queries";
import { Field } from "#/components/ui/Field";
import { useAppForm } from "#/integrations/form";
import Button from "#/components/ui/Button";
import Input from "#/components/ui/Input";

export const Route = createFileRoute("/console/manage/apps/$id/oauth2")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      getAppOAuth2ConfigQuery({ id: params.id }),
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
          className={clsx(
            "font-mono",
            hidden && !value && "pointer-events-none select-none",
          )}
          readOnly
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

  const { data } = useSuspenseQuery(getAppOAuth2ConfigQuery({ id: params.id }));

  const form = useAppForm({
    defaultValues: {
      allowedCallbackUrls: "",
    },
  });

  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="font-heading text-xl font-bold">Add to your app</h2>
        <p className="mt-0.5 text-sm text-neutral-600">
          Everything you need to implement login.
        </p>
        <div className="mt-4 space-y-4">
          <CopyField label="Client ID" value={data.clientId} />
          <CopyField label="Client secret" value={data.clientSecret} hidden />
          <CopyField
            label="Discovery URL"
            value={"https://example.com/.well-known/openid-configuration"}
          />
          <p className="text-sm font-semibold text-rose-700">Get started →</p>
        </div>
      </section>
      <section>
        <h2 className="font-heading text-xl font-bold">Login settings</h2>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-3 space-y-4"
        >
          {/*{error && <FormMessage state="error">{error.message}</FormMessage>}*/}
          <form.AppField name="allowedCallbackUrls">
            {(field) => (
              <field.TextareaField
                label="Allowed callback URLs"
                description="Allowed URLs for redirecting users to after they've logged in. One per line, either https:// or http://localhost."
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton
              // disabled={isPending}
              size="md"
              className="w-fit!"
            >
              <span>Update</span>
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </section>
      <section>
        <h2 className="font-heading text-xl font-bold">Danger zone</h2>
        <div className="mt-2 flex gap-3 opacity-50">
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
