import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import clsx from "clsx";
import { createContext, use, useMemo } from "react";

type OTPFieldContext = {
  length: number;
};
const OTPFieldContext = createContext<OTPFieldContext | null>(null);

function useOTPFieldContext() {
  const context = use(OTPFieldContext);
  if (!context) {
    throw new Error(
      "useOTPFieldContext() must be used within a context provider",
    );
  }
  return context;
}

function Root({ className, children, ...props }: BaseOTPField.Root.Props) {
  return (
    <OTPFieldContext value={{ length: props.length }}>
      <BaseOTPField.Root
        {...props}
        className={clsx("flex items-center gap-3", className)}
      >
        {children}
      </BaseOTPField.Root>
    </OTPFieldContext>
  );
}

function Input({
  placeholder = "•",
  className,
  ...props
}: BaseOTPField.Input.Props) {
  return (
    <BaseOTPField.Input
      {...props}
      placeholder={placeholder}
      className={clsx(
        "h-16 w-full min-w-0 flex-1 rounded-md border border-neutral-300 bg-neutral-50 px-4 text-center text-2xl inset-shadow-xs ring-rose-600 transition outline-none placeholder:text-neutral-400 focus:border-rose-600 focus:ring-1 focus:placeholder:text-transparent disabled:bg-neutral-200 disabled:text-neutral-500",
        className,
      )}
    />
  );
}

function Inputs({
  split = false,
  ...props
}: BaseOTPField.Input.Props & { split?: boolean }) {
  const { length } = useOTPFieldContext();
  const halfLength = useMemo(() => Math.ceil(length / 2), [length]);

  if (split) {
    return (
      <>
        {Array.from({ length: halfLength }, (_, index) => (
          <Input
            {...props}
            // biome-ignore lint/suspicious/noArrayIndexKey: intentional
            key={index}
            aria-label={`Character ${index + 1} of ${length}`}
          />
        ))}
        <Separator />
        {Array.from({ length: length - halfLength }, (_, index) => (
          <Input
            {...props}
            // biome-ignore lint/suspicious/noArrayIndexKey: intentional
            key={index}
            aria-label={`Character ${halfLength + index + 1} of ${length}`}
          />
        ))}
      </>
    );
  }

  return Array.from({ length }, (_, index) => (
    <Input
      {...props}
      // biome-ignore lint/suspicious/noArrayIndexKey: intentional
      key={index}
      aria-label={`Character ${index + 1} of ${length}`}
    />
  ));
}

function Separator({ className, ...props }: BaseOTPField.Separator.Props) {
  return (
    <BaseOTPField.Separator
      {...props}
      className={clsx("mx-0.5 h-0.5 w-2.5 bg-neutral-400", className)}
    />
  );
}

export const OTPField = {
  Root,
  Input,
  Inputs,
  Separator,
};
