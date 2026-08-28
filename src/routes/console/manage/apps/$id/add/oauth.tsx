import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createOAuthConfigMutation } from "#/actions/apps/oauth/queries";
import { appOAuthSchema } from "#/actions/apps/oauth/schemas";
import { createOAuthSchema } from "#/api/routers/apps/schemas";
import FormMessage from "#/components/form/FormMessage";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/console/manage/apps/$id/add/oauth")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    ...createOAuthConfigMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["apps", params.id],
      });
      navigate({ to: "/console/manage/apps/$id/oauth" });
    },
  });

  const form = useAppForm({
    defaultValues: {
      allowedCallbackUrls: "",
    },
    validators: {
      onDynamic: appOAuthSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: ({ value }) => mutate({ ...value, id: params.id }),
  });

  return (
    <div className="p-8">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {error && <FormMessage state="error">{error.message}</FormMessage>}
        <form.AppField name="allowedCallbackUrls">
          {(field) => (
            <field.TextareaField
              label="Allowed callback URLs"
              description="Allowed URLs for redirecting users to after they've logged in. One per line, either https:// or http://localhost."
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton disabled={isPending} className="w-fit!">
            <span>Add</span>
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
