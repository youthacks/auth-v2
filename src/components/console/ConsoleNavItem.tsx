import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

export default function ConsoleNavItem({
  icon: Icon,
  active = false,
  children,
  ...props
}: ComponentProps<"a"> & { icon: LucideIcon; active?: boolean }) {
  return (
    <a
      {...props}
      className={clsx(
        "relative isolate -mx-3 flex h-10 items-center gap-1.5 rounded-md border px-3",
        active
          ? "border-neutral-300 bg-white text-rose-700 shadow-xs"
          : "border-transparent text-neutral-600 transition-colors hover:bg-neutral-200",
      )}
    >
      <div
        className={clsx(
          "absolute top-3 left-1 h-4 w-0.5 -translate-y-px rounded-full bg-current transition",
          !active && "scale-y-0 opacity-0",
        )}
      ></div>
      <Icon className="size-4" />
      <span className={clsx(active && "font-semibold")}>{children}</span>
    </a>
  );
}
