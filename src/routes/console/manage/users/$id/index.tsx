import { revalidateLogic } from "@tanstack/react-form";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { orpc } from "#/api/client";
import { updateUserSchema } from "#/api/routers/users/schemas";
import FormMessage from "#/components/form/FormMessage";
import { Field } from "#/components/ui/Field";
import { Fieldset } from "#/components/ui/Fieldset";
import { useAppForm } from "#/integrations/form";
import { getSessionName, SessionIcon } from "#/lib/userAgent";

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
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(
    orpc.users.get.queryOptions({ input: { id: params.id } }),
  );
  const { data: sessions } = useQuery(
    orpc.users.sessions.get.queryOptions({ input: { id: params.id } }),
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
          <div className="grid grid-cols-2 gap-4">
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
            <p className="w-48 flex-none truncate font-medium">Created at</p>
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
                    <p className="text-xs text-neutral-600">1.2.3.4</p>
                  </div>
                </div>
                <p
                  title={dayjs(session.createdAt).toString()}
                  className="w-48 flex-none truncate text-sm underline decoration-dotted underline-offset-2"
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
