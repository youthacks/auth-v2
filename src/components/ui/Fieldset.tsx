import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

<section className="grid grid-cols-[2fr_3fr] gap-8">
  <h2 className="font-heading text-xl font-bold">Configuration</h2>
</section>;

function Root({ className, ...props }: BaseFieldset.Root.Props) {
  return (
    <BaseFieldset.Root
      {...props}
      className={clsx(
        "grid grid-cols-[2fr_3fr] gap-x-6 gap-y-6 *:col-start-2",
        className,
      )}
    />
  );
}
function Legend({ className, ...props }: BaseFieldset.Legend.Props) {
  return (
    <BaseFieldset.Legend
      {...props}
      className={clsx("font-heading col-start-1! text-xl font-bold", className)}
    />
  );
}

export const Fieldset = {
  Root,
  Legend,
};
