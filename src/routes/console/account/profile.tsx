import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { orpc } from "#/api/client";
import { updateMeSchema } from "#/api/routers/users/schemas";
import FormMessage from "#/components/form/FormMessage";
import Button from "#/components/ui/Button";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/console/account/profile")({
  component: RouteComponent,
});

function ProfileSection() {
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(orpc.users.me.get.queryOptions());

  const { mutateAsync, isPending, isSuccess, error } = useMutation(
    orpc.users.me.update.mutationOptions({
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
      onDynamic: updateMeSchema,
    },
    validationLogic: revalidateLogic(),

    onSubmit: async ({ value, formApi }) => {
      try {
        await mutateAsync(value);
        formApi.reset(value);
      } catch (_e) {}
    },
  });

  return (
    <section>
      <h2 className="font-heading text-xl font-bold">Profile</h2>
      <p className="mt-0.5 text-sm text-neutral-600">A little about you.</p>
      {isSuccess && (
        <FormMessage state="success" className="mt-4">
          Your profile has been updated.
        </FormMessage>
      )}
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
    </div>
  );
}
