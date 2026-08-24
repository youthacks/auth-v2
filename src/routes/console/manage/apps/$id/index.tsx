import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "#/api/client";
import { updateAppSchema } from "#/api/routers/apps/schemas";
import FormMessage from "#/components/form/FormMessage";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/console/manage/apps/$id/")({
  component: RouteComponent,
});

function InfoSection() {
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    orpc.apps.get.queryOptions({ input: { id: params.id } }),
  );

  const { mutateAsync, isPending, error } = useMutation(
    orpc.apps.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.apps.key(),
        });
      },
    }),
  );

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
    <section>
      {error && (
        <FormMessage state="error" className="mb-4">
          {error.message}
        </FormMessage>
      )}
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.AppField name="name">
          {(field) => (
            <field.TextField type="text" label="Name" placeholder={data.name} />
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
        <form.AppForm>
          <form.SubmitButton disabled={isPending} className="w-fit!">
            <span>Save</span>
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </section>
  );
}

function RouteComponent() {
  return (
    <div className="p-8">
      <div className="space-y-8">
        <InfoSection />
      </div>
    </div>
  );
}
