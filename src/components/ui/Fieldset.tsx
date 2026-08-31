import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

function Root({ className, ...props }: BaseFieldset.Root.Props) {
  return (
    <BaseFieldset.Root
      {...props}
      className={clsx(
        "grid grid-cols-1 gap-x-6 gap-y-6 xl:grid-cols-[2fr_3fr] xl:*:col-start-2",
        className,
      )}
    />
  );
}
function Legend({ className, ...props }: BaseFieldset.Legend.Props) {
  return (
    <BaseFieldset.Legend
      {...props}
      className={clsx("col-start-1! font-heading text-xl font-bold", className)}
    />
  );
}

export const Fieldset = {
  Root,
  Legend,
};
