import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { acceptSignupTerms } from "#/actions/auth/signup";
import { getSignupQuery } from "#/actions/auth/signup/queries";
import { acceptSignupTermsSchema } from "#/actions/auth/signup/schemas";
import { FormHeader } from "#/components/form/FormHeader";
import FormMessage from "#/components/form/FormMessage";
import { useAppForm } from "#/integrations/form";

export const Route = createFileRoute("/_auth/auth/signup/$id/terms")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      getSignupQuery({ id: params.id }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const params = Route.useParams();
  const queryClient = useQueryClient();

  const { data: signup } = useSuspenseQuery(getSignupQuery({ id: params.id }));

  const { mutate, isPending, error } = useMutation({
    mutationFn: acceptSignupTerms,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["auth", "session"] });
      await navigate({ to: "/auth/finish" });
    },
  });

  const form = useAppForm({
    defaultValues: {
      termsAccepted: false,
      privacyAccepted: false,
    },
    validators: {
      onChange: acceptSignupTermsSchema,
    },

    onSubmit: ({ value }) => mutate({ data: { ...value, id: params.id } }),
  });

  return (
    <div className="p-8">
      <FormHeader
        firstName={signup.firstName}
        onLogout={() => navigate({ to: "/auth" })}
      />

      <h1 className="font-heading text-3xl font-bold">Last step</h1>
      <p className="mt-1 text-neutral-600">
        Please don’t skip - it’s important.
      </p>

      <div className="mt-6 leading-relaxed">
        <p>
          By logging in and using any Youthacks systems, you agree to our{" "}
          <span className="font-medium text-rose-700 underline-offset-2 transition hover:text-rose-900 hover:underline">
            Conditions of Use
          </span>{" "}
          and{" "}
          <span className="font-medium text-rose-700 underline-offset-2 transition hover:text-rose-900 hover:underline">
            Privacy Policy
          </span>
          .
        </p>
        <p className="mt-3">
          It’s really important that you read and understand them both. That
          way, you know what rules you need to follow, and what you can expect
          from us.
        </p>
        <p className="mt-3">Some key points:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your account is yours, so don't share it with anyone else.</li>
          <li>
            When we say ‘hacking’, we mean the good kind. Using our systems to
            disrupt or cause harm to us or others is off-limits.
          </li>
          <li>
            We’ll keep information about you like your name and email until you
            delete your account, unless we need to for longer (for example,
            after you’ve attended an event).
          </li>
          <li>
            These systems are provided ‘as-is’ - while we try our best, you
            agree we’re not responsible if things go wrong.
          </li>
        </ul>
      </div>

      <hr className="mt-6 border-neutral-300" />

      {error && (
        <FormMessage state="error" className="mt-6">
          {error.message}
        </FormMessage>
      )}

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-6 space-y-4"
      >
        <div className="space-y-2.5">
          <form.AppField name="termsAccepted">
            {(field) => (
              <field.CheckboxField label="I accept the Conditions of Use" />
            )}
          </form.AppField>
          <form.AppField name="privacyAccepted">
            {(field) => (
              <field.CheckboxField label="I accept the Privacy Policy" />
            )}
          </form.AppField>
        </div>
        <form.AppForm>
          <form.SubmitButton disabled={isPending} size="lg" className="w-full">
            Sign up
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
