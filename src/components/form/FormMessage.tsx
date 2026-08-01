import { cva, type VariantProps } from "cva";
import { CheckCircle2Icon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import type { ComponentProps } from "react";
import type { Merge } from "#/types";

export const formMessage = cva({
  base: "mt-6 flex gap-2 rounded-md border p-2.5 px-3 inset-shadow-xs",
  variants: {
    state: {
      info: "border-neutral-200 bg-neutral-100 text-neutral-600",
      error: "border-rose-200 bg-rose-100 text-rose-700",
      success: "border-cyan-200 bg-cyan-100 text-cyan-700",
    },
  },
});

export default function FormMessage({
  state = "info",
  className,
  children,
  ...props
}: Merge<ComponentProps<"div">, VariantProps<typeof formMessage>>) {
  const Icon = {
    info: InfoIcon,
    success: CheckCircle2Icon,
    error: TriangleAlertIcon,
  }[state];

  return (
    <div {...props} className={formMessage({ state, className })}>
      <Icon strokeWidth={2.5} className="mt-0.5 size-4 flex-none" />
      <p className="text-sm">{children}</p>
    </div>
  );
}
