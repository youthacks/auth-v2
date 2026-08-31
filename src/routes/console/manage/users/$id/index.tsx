import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { getUserQuery, updateUserMutation } from "#/actions/users/queries";
import { userSchema } from "#/actions/users/schema";
import { getSessionsQuery } from "#/actions/users/sessions/queries";
import FormMessage from "#/components/form/FormMessage";
import { Field } from "#/components/ui/Field";
import { Fieldset } from "#/components/ui/Fieldset";
import { useAppForm } from "#/integrations/form";
import { getSessionName, SessionIcon } from "#/lib/userAgent";

export const Route = createFileRoute("/console/manage/users/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(getUserQuery({ id: params.id }));
  const { data: sessions } = useQuery(getSessionsQuery({ id: params.id }));

  const { mutateAsync, isPending, error } = useMutation({
    ...updateUserMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const form = useAppForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: dayjs(user.dateOfBirth).format("YYYY-MM-DD"),
      isLastNameFirst: user.isLastNameFirst,
      avatarAssetId: user.avatar?.id || null,
    },
    validators: {
      onDynamic: userSchema,
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
          <Fieldset.Legend>User profile</Fieldset.Legend>
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
                      placeholder={user?.firstName}
                    />
                  )}
                </form.AppField>
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
            )}
          </form.Subscribe>
          <form.AppField name="isLastNameFirst">
            {(field) => <field.CheckboxField label="Display last name first" />}
          </form.AppField>
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
          <form.AppField name="avatarAssetId">
            {(field) => <field.UploadInputField as="avatar" label="Avatar" />}
          </form.AppField>
        </Fieldset.Root>

        <form.AppForm>
          <form.StatusBar disabled={isPending} />
        </form.AppForm>
      </form>

      <section>
        <h2 className="font-heading text-xl font-bold">Sessions</h2>
        <div className="mt-3 divide-y divide-neutral-200 overflow-clip rounded-lg border border-neutral-200">
          <div className="flex gap-4 bg-neutral-100 px-4 py-1.5 text-sm">
            <p className="min-w-0 flex-1 truncate font-medium">Device</p>
            <p className="w-48 flex-none truncate font-medium max-sm:hidden">
              Created at
            </p>
          </div>
          {sessions ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex h-16 w-full items-center gap-4 px-4 text-left"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <SessionIcon userAgent={session.userAgent} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {getSessionName(session.userAgent)}
                    </p>
                    <p className="truncate text-xs text-neutral-600">
                      {session.ipAddress || (
                        <span className="italic">unknown IP</span>
                      )}
                    </p>
                  </div>
                </div>
                <p
                  title={dayjs(session.createdAt).toString()}
                  className="w-48 flex-none truncate text-sm underline decoration-dotted underline-offset-2 max-sm:hidden"
                >
                  {dayjs(session.createdAt).fromNow()}
                </p>
              </div>
            ))
          ) : (
            <div className="flex h-16 w-full items-center gap-4 px-4">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="size-8 animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="min-w-0 flex-1">
                  <div className="h-4 max-w-48 animate-pulse rounded-sm bg-neutral-200"></div>
                  <div className="mt-1 h-3 max-w-20 animate-pulse rounded-sm bg-neutral-200"></div>
                </div>
              </div>
              <div className="w-48 flex-none">
                <div className="h-4 w-24 animate-pulse rounded-sm bg-neutral-200"></div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
