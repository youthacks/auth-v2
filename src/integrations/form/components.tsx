import { useSelector } from "@tanstack/react-form";
import { useFieldContext, useFormContext } from "#/hooks/demo.form-context";
import Button from "#/components/ui/Button";
import { useMemo, type ComponentProps } from "react";
import type Input from "#/components/ui/Input";
import { Field } from "#/components/ui/Field";
import { ArrowRightIcon } from "lucide-react";

function ErrorMessage({ errors }: { errors: string | { message: string }[] }) {
  const error = useMemo(() => errors?.[0], [errors]);
  if (!error) return null;

  return (
    <Field.Error>
      {typeof error === "string" ? error : error.message}
    </Field.Error>
  );
}

export function TextField({
  label,
  ...props
}: { label: string } & ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();
  const errors = useSelector(field.store, (state) => state.meta.errors);

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Field.Control
        {...props}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={(v) => field.handleChange(v)}
      />
      {field.state.meta.isTouched && <ErrorMessage errors={errors} />}
    </Field.Root>
  );
}

export function SubmitButton({
  children,
  type = "submit",
  color = "primary",
  disabled,
  ...props
}: ComponentProps<typeof Button>) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          {...props}
          color={color}
          type={type}
          disabled={disabled || !canSubmit || isSubmitting}
        >
          {children}
          <ArrowRightIcon strokeWidth={2.5} className="size-4" />
        </Button>
      )}
    </form.Subscribe>
  );
}
