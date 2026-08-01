import { queryOptions } from "@tanstack/react-query";
import { getLogin } from ".";

export const getLoginQuery = (data: { id: string }) =>
  queryOptions({
    queryKey: ["auth", "login", "getLogin", data],
    queryFn: ({ signal }) => getLogin({ data, signal }),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
