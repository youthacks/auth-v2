import { useIsMutating } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

export function FormHeader({
  firstName,
  onLogout,
}: {
  firstName: string;
  onLogout: () => void;
}) {
  const isMutating = useIsMutating();
  const { isLoading } = useRouterState();
  const disabled = useMemo(
    () => !!isMutating || isLoading,
    [isMutating, isLoading],
  );

  return (
    <div className="mb-5 flex items-center gap-2">
      <span className="size-5 rounded-full bg-linear-to-br from-rose-600 to-red-600"></span>
      <span className="text-sm leading-none">{firstName}</span>
      <div className="flex-1"></div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onLogout()}
        className="text-sm leading-none font-semibold text-rose-700 underline-offset-2 hover:underline disabled:text-neutral-300 disabled:no-underline"
      >
        Not you?
      </button>
    </div>
  );
}
