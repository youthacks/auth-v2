import { Field as BaseField } from "@base-ui/react/field";
import { useSelector } from "@tanstack/react-form";
import clsx from "clsx";
import { InfoIcon } from "lucide-react";
import { type ComponentProps, useMemo } from "react";
import Button from "#/components/ui/Button";
import Checkbox from "#/components/ui/Checkbox";
import { Field } from "#/components/ui/Field";
import type Input from "#/components/ui/Input";
import { OTPField as BaseOTPField } from "#/components/ui/OTPField";
import Textarea from "#/components/ui/Textarea";
import { UploadInput } from "#/components/ui/UploadInput";
import { useFieldContext, useFormContext } from "./context";

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
  description,
  ...props
}: { label: string; description?: string } & ComponentProps<typeof Input>) {
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
      {description && <Field.Description>{description}</Field.Description>}
      {field.state.meta.isTouched && <ErrorMessage errors={errors} />}
    </Field.Root>
  );
}

export function TextareaField({
  label,
  description,
  ...props
}: { label: string; description?: string } & ComponentProps<"textarea">) {
  const field = useFieldContext<string>();
  const errors = useSelector(field.store, (state) => state.meta.errors);

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Textarea
        {...props}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(ev) => field.handleChange(ev.target.value)}
      />
      {description && <Field.Description>{description}</Field.Description>}
      {field.state.meta.isTouched && <ErrorMessage errors={errors} />}
    </Field.Root>
  );
}

export function OTPField({
  label,
  split,
  hideError = false,
  ...props
}: { label: string; split?: boolean; hideError?: boolean } & ComponentProps<
  typeof BaseOTPField.Root
>) {
  const field = useFieldContext<string>();
  const errors = useSelector(field.store, (state) => state.meta.errors);

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <BaseOTPField.Root
        {...props}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={(v) => field.handleChange(v)}
      >
        <BaseOTPField.Inputs split={split} />
      </BaseOTPField.Root>
      {field.state.meta.isTouched && !hideError && (
        <ErrorMessage errors={errors} />
      )}
    </Field.Root>
  );
}

export function CheckboxField({
  label,
  ...props
}: { label: string } & ComponentProps<typeof Checkbox>) {
  const field = useFieldContext<boolean>();
  const errors = useSelector(field.store, (state) => state.meta.errors);

  return (
    <Field.Root>
      <BaseField.Label className="flex items-center gap-2 text-sm">
        <Checkbox
          {...props}
          checked={field.state.value}
          onBlur={field.handleBlur}
          onCheckedChange={(v) => field.handleChange(v)}
        />
        {label}
      </BaseField.Label>
      {field.state.meta.isTouched && <ErrorMessage errors={errors} />}
    </Field.Root>
  );
}

export function UploadInputField({
  label,
  description,
  ...props
}: { label: string; description?: string } & Omit<
  ComponentProps<typeof UploadInput>,
  "value" | "onChange"
>) {
  const field = useFieldContext<string | null>();
  const errors = useSelector(field.store, (state) => state.meta.errors);

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <UploadInput
        {...props}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(v) => field.handleChange(v)}
      />
      {description && <Field.Description>{description}</Field.Description>}
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
    <form.Subscribe
      selector={(state) => [state.isDirty, state.canSubmit, state.isSubmitting]}
    >
      {([isDirty, canSubmit, isSubmitting]) => (
        <Button
          {...props}
          color={color}
          type={type}
          disabled={disabled || !isDirty || !canSubmit || isSubmitting}
        >
          {children}
          {/*<ArrowRightIcon strokeWidth={2.5} className="size-4" />*/}
        </Button>
      )}
    </form.Subscribe>
  );
}

export function StatusBar({ disabled }: { disabled?: boolean }) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [
        state.isDefaultValue,
        state.canSubmit,
        state.isSubmitting,
      ]}
    >
      {([isDefaultValue, canSubmit, isSubmitting]) => (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-10 m-0! flex justify-center pl-80">
          <div
            className={clsx(
              "pointer-events-auto flex w-full max-w-md origin-bottom items-center gap-2 rounded-xl border border-neutral-200 bg-white shadow-md transition",
              isDefaultValue ? "translate-y-2 scale-95 opacity-0" : "delay-200",
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1.5 px-4">
              <InfoIcon className="size-4 flex-none text-neutral-500" />
              <p className="truncate text-sm text-neutral-600">
                You have unsaved changes
              </p>
            </div>
            <div className="flex gap-1.5 p-2 pl-0">
              <Button
                onClick={() => form.reset()}
                disabled={isDefaultValue || isSubmitting || disabled}
                size="md"
              >
                <span>Discard</span>
              </Button>
              <Button
                type="submit"
                disabled={
                  isDefaultValue || !canSubmit || isSubmitting || disabled
                }
                color="primary"
                size="md"
              >
                <span>Save</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </form.Subscribe>
  );
}
