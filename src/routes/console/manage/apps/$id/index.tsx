import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getAppQuery, updateAppMutation } from "#/actions/apps/queries";
import { updateAppSchema } from "#/api/routers/apps/schemas";
import FormMessage from "#/components/form/FormMessage";
import { Fieldset } from "#/components/ui/Fieldset";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/console/manage/apps/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(getAppQuery({ id: params.id }));

  const { mutateAsync, isPending, error } = useMutation({
    ...updateAppMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: data.name,
      description: data.description || "",
      homepageUrl: data.homepageUrl || "",
    },
    validators: {
      onDynamic: updateAppSchema,
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
        {error && (
          <FormMessage state="error" className="mb-4">
            {error.message}
          </FormMessage>
        )}
        <Fieldset.Root>
          <Fieldset.Legend>App info</Fieldset.Legend>
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                type="text"
                label="Name"
                placeholder={data.name}
              />
            )}
          </form.AppField>
          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Description"
                placeholder={data.description || ""}
                description="Optional"
              />
            )}
          </form.AppField>
          <form.AppField name="homepageUrl">
            {(field) => (
              <field.TextField
                type="url"
                label="Homepage URL"
                placeholder={data.homepageUrl}
              />
            )}
          </form.AppField>
        </Fieldset.Root>

        <form.AppForm>
          <form.StatusBar disabled={isPending} />
        </form.AppForm>
      </form>
    </div>
  );
}
