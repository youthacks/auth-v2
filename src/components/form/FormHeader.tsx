import { useIsMutating } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { DefaultAvatar } from "../ui/Avatar";

export function FormHeader({
  firstName,
  avatarUrl,
  onLogout,
}: {
  firstName: string;
  avatarUrl: string | undefined;
  onLogout: () => void;
}) {
  const isMutating = useIsMutating();
  const { isLoading } = useRouterState();
  const disabled = useMemo(
    () => !!isMutating || isLoading,
    [isMutating, isLoading],
  );

  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="size-6 flex-none overflow-clip rounded-full border border-neutral-200">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <DefaultAvatar className="text-xs">{firstName[0]}</DefaultAvatar>
        )}
      </div>
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
