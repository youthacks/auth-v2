import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { getUserQuery, updateUserMutation } from "#/actions/users/queries";
import { userSchema } from "#/actions/users/schema";
import FormMessage from "#/components/form/FormMessage";
import Button from "#/components/ui/Button";
import { Fieldset } from "#/components/ui/Fieldset";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/console/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(getUserQuery({ id: "me" }));

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    ...updateUserMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });
  const form = useAppForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: dayjs(user.dateOfBirth).format("YYYY-MM-DD"),
      isLastNameFirst: user.isLastNameFirst,
      avatarAssetId: user.avatar?.id ?? null,
    },
    validators: {
      onDynamic: userSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: async ({ value, formApi }) => {
      try {
        await mutateAsync({ ...value, id: "me" });
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
        {isSuccess && (
          <FormMessage state="success">
            Your profile has been updated.
          </FormMessage>
        )}
        {error && <FormMessage state="error">{error.message}</FormMessage>}
        <Fieldset.Root>
          <Fieldset.Legend>Your profile</Fieldset.Legend>
          <form.Subscribe selector={(state) => state.values.isLastNameFirst}>
            {(isLastNameFirst) => (
              <div
                className={clsx(
                  "grid grid-cols-2 gap-4",
                  isLastNameFirst && "*:first:order-last",
                )}
              >
                <form.AppField name="firstName">
                  {(field) => (
                    <field.TextField
                      type="text"
                      label="First name"
                      placeholder={user.firstName}
                    />
                  )}
                </form.AppField>
                <form.AppField name="lastName">
                  {(field) => (
                    <field.TextField
                      type="text"
                      label="Last name"
                      placeholder={user.lastName}
                    />
                  )}
                </form.AppField>
              </div>
            )}
          </form.Subscribe>
          <form.AppField name="isLastNameFirst">
            {(field) => <field.CheckboxField label="Display last name first" />}
          </form.AppField>
          <form.AppField name="dateOfBirth">
            {(field) => <field.TextField type="date" label="Date of birth" />}
          </form.AppField>
          <form.AppField name="avatarAssetId">
            {(field) => <field.UploadInputField as="avatar" label="Avatar" />}
          </form.AppField>
        </Fieldset.Root>

        <form.AppForm>
          <form.StatusBar disabled={isPending} />
        </form.AppForm>
      </form>
      <section>
        <h2 className="font-heading text-xl font-bold">Danger zone</h2>
        <p className="mt-0.5 text-sm text-neutral-600">Scary things ahead.</p>
        <div className="mt-3 flex gap-3 opacity-50">
          <Button size="sm">Deactivate account</Button>
          <Button size="sm" color="danger">
            Delete account
          </Button>
        </div>
      </section>
    </div>
  );
}
