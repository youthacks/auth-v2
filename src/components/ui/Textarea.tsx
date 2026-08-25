import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";
import type { Merge } from "#/types";

export const textarea = cva({
  base: "w-full rounded-lg border border-neutral-300 px-4 shadow-xs ring-rose-600 transition outline-none placeholder:text-neutral-500 focus:border-rose-600 focus:ring-1 disabled:bg-neutral-200 disabled:text-neutral-500",
  variants: {
    size: {
      md: "py-2",
      lg: "py-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default function Textarea({
  size,
  className,
  children,
  ...props
}: Merge<ComponentProps<"textarea">, VariantProps<typeof textarea>>) {
  return <textarea {...props} className={textarea({ size, className })} />;
}
