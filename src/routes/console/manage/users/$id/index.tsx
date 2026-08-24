import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { orpc } from "#/api/client";
import { updateUserSchema } from "#/api/routers/users/schemas";
import FormMessage from "#/components/form/FormMessage";
import { useAppForm } from "#/integrations/form";
import { Field } from "#/components/ui/Field";

export const Route = createFileRoute("/console/manage/users/$id/")({
  component: RouteComponent,
});

function ProfileSection() {
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(
    orpc.users.get.queryOptions({ input: { id: params.id } }),
  );

  const { mutateAsync, isPending, error } = useMutation(
    orpc.users.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.users.key() });
      },
    }),
  );
  const form = useAppForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.dateOfBirth
        ? dayjs(user.dateOfBirth).format("YYYY-MM-DD")
        : "",
    },
    validators: {
      onDynamic: updateUserSchema,
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
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <form.AppField name="firstName">
              {(field) => (
                <field.TextField
                  type="text"
                  label="First name"
                  placeholder={user?.firstName}
                />
              )}
            </form.AppField>
          </div>
          <div className="min-w-0 flex-1">
            <form.AppField name="lastName">
              {(field) => (
                <field.TextField
                  type="text"
                  label="Last name"
                  placeholder={user?.lastName}
                />
              )}
            </form.AppField>
          </div>
        </div>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Control disabled value={user.email} />
          <Field.Description>
            Ask the user to log in to change their email.
          </Field.Description>
        </Field.Root>
        <form.AppField name="dateOfBirth">
          {(field) => <field.TextField type="date" label="Date of birth" />}
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
        <ProfileSection />
      </div>
    </div>
  );
}
