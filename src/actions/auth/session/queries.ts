import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from ".";

export const getCurrentUserQuery = () =>
  queryOptions({
    queryKey: ["auth", "session", "getCurrentUser"],
    queryFn: ({ signal }) => getCurrentUser({ signal }),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
