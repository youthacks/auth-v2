import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import clsx from "clsx";
import { CheckIcon } from "lucide-react";

export default function Checkbox({
  className,
  children,
  ...props
}: BaseCheckbox.Root.Props) {
  return (
    <BaseCheckbox.Root
      {...props}
      className={clsx(
        "flex size-5 shrink-0 items-center justify-center rounded-sm border data-checked:border-rose-600 data-checked:bg-rose-600 data-unchecked:border-neutral-300",
        className,
      )}
    >
      <BaseCheckbox.Indicator className="flex data-unchecked:hidden">
        <CheckIcon strokeWidth={4} className="size-2.5 text-white" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
