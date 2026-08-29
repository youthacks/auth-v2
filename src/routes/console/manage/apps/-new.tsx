import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createAppMutation } from "#/actions/apps/queries";
import { appSchema } from "#/actions/apps/schemas";
import FormMessage from "#/components/form/FormMessage";
import { Dialog, type DialogHandle } from "#/components/ui/Dialog";
import { useAppForm } from "#/integrations/form";

const Route = getRouteApi("/console/manage/apps/");

export default function NewAppDialog({
  handle,
}: {
  handle: DialogHandle<unknown>;
}) {
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    ...createAppMutation(),

    onSuccess: async (data) => {
      queryClient.removeQueries({ queryKey: ["apps"] });
      await navigate({
        to: "/console/manage/apps/$id",
        params: { id: data.id },
      });
      handle.close();
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      homepageUrl: "",
      logoAssetId: null as string | null,
      backgroundAssetId: null as string | null,
    },
    validators: {
      onDynamic: appSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: ({ value }) => mutate(value),
  });

  return (
    <Dialog.Root handle={handle}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <Dialog.CloseButton />

            <Dialog.Title>New application</Dialog.Title>
            {error && (
              <FormMessage state="error" className="mt-4">
                {error.message}
              </FormMessage>
            )}
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                form.handleSubmit();
              }}
              className="mt-4 space-y-4"
            >
              <form.AppField name="name">
                {(field) => (
                  <field.TextField
                    type="text"
                    label="Name"
                    placeholder="Cool as Hack"
                  />
                )}
              </form.AppField>
              <form.AppField name="description">
                {(field) => (
                  <field.TextareaField
                    label="Description"
                    description="Optional"
                  />
                )}
              </form.AppField>
              <form.AppField name="homepageUrl">
                {(field) => (
                  <field.TextField
                    type="url"
                    label="Homepage URL"
                    placeholder="https://coolashack.youthacks.org"
                  />
                )}
              </form.AppField>
              <form.AppForm>
                <form.SubmitButton disabled={isPending} className="w-fit!">
                  <span>Save</span>
                </form.SubmitButton>
              </form.AppForm>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
