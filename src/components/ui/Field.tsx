import { Field as BaseField } from "@base-ui/react/field";
import clsx from "clsx";
import type { VariantProps } from "cva";
import type { Merge } from "#/types";
import { input } from "./Input";

function Root({ className, ...props }: BaseField.Root.Props) {
  return <BaseField.Root {...props} className={clsx("grid", className)} />;
}
const Item = BaseField.Item;

function Label({ className, ...props }: BaseField.Label.Props) {
  return (
    <BaseField.Label
      {...props}
      className={clsx("mb-1 block max-w-fit text-sm font-semibold", className)}
    />
  );
}

function Description({ className, ...props }: BaseField.Description.Props) {
  return (
    <BaseField.Description
      {...props}
      className={clsx("mt-1 text-sm text-neutral-600", className)}
    />
  );
}

// biome-ignore lint/suspicious/noShadowRestrictedNames: intentional
function Error({ className, match = true, ...props }: BaseField.Error.Props) {
  return (
    <BaseField.Error
      {...props}
      match={match}
      className={clsx("mt-1 text-sm text-rose-700", className)}
    />
  );
}

function Control({
  size,
  className,
  ...props
}: Merge<BaseField.Control.Props, VariantProps<typeof input>>) {
  return (
    <BaseField.Control {...props} className={input({ size, className })} />
  );
}

export const Field = {
  Root,
  Label,
  Control,
  Description,
  Item,
  Error,
};
