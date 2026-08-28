import { queryOptions } from "@tanstack/react-query";
import { getCurrentSession } from ".";

export const getCurrentSessionQuery = () =>
  queryOptions({
    queryKey: ["auth", "sessions", "current"],
    queryFn: () => getCurrentSession(),
  });
