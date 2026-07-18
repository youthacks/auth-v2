import { Input as BaseInput } from "@base-ui/react/input";
import { cva, type VariantProps } from "cva";
import type { Merge } from "#/types";

export const input = cva({
  base: "w-full rounded-md border border-neutral-300 bg-neutral-50 px-4 inset-shadow-xs ring-rose-600 transition outline-none placeholder:text-neutral-500 focus:border-rose-600 focus:ring-1 disabled:bg-neutral-200 disabled:text-neutral-500",
  variants: {
    size: {
      md: "h-10",
      lg: "h-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default function Input({
  size,
  className,
  children,
  ...props
}: Merge<BaseInput.Props, VariantProps<typeof input>>) {
  return <BaseInput {...props} className={input({ size, className })} />;
}
