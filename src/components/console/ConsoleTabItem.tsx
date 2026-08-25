import { createLink } from "@tanstack/react-router";
import clsx from "clsx";
import type { ComponentProps } from "react";

export default function ConsoleTabItem({
  active = false,
  children,
  ...props
}: ComponentProps<"a"> & { active?: boolean }) {
  return (
    <a
      {...props}
      className={clsx(
        "group -mb-0.5 flex border-b-[3px] py-2 text-sm font-medium",
        active
          ? "border-rose-700 text-rose-700"
          : "border-transparent text-neutral-600 transition hover:border-b-neutral-200",
      )}
    >
      {children}
    </a>
  );
}

export const ConsoleTabLink = createLink(ConsoleTabItem);
