import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "cva";
import type { Merge } from "#/types";

export const button = cva({
  base: "flex items-center justify-center gap-1.5 rounded-lg shadow-xs transition disabled:opacity-50",
  variants: {
    color: {
      outline:
        "border border-neutral-300 bg-white hover:not-disabled:bg-neutral-200",
      default:
        "border border-neutral-300 bg-neutral-100 font-semibold hover:not-disabled:bg-neutral-200",
      danger:
        "border border-neutral-300 bg-neutral-100 font-semibold text-rose-700 hover:not-disabled:border-rose-800 hover:not-disabled:bg-rose-700 hover:not-disabled:text-white",
      primary:
        "border border-rose-800 bg-rose-700 font-semibold text-white shadow-xs hover:not-disabled:bg-rose-800",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
});

export default function Button({
  color,
  size,
  className,
  children,
  ...props
}: Merge<BaseButton.Props, VariantProps<typeof button>>) {
  return (
    <BaseButton {...props} className={button({ color, size, className })}>
      {children}
    </BaseButton>
  );
}
