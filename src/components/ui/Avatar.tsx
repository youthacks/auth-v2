import clsx from "clsx";
import type { ComponentProps } from "react";

export function DefaultAvatar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        "grid size-full place-items-center bg-radial-[at_75%_75%] from-rose-200 to-rose-100 leading-none font-medium text-rose-700",
        className,
      )}
    ></div>
  );
}
