import { queryOptions } from "@tanstack/react-query";
import { getSignup } from ".";

export const getSignupQuery = (data: { id: string }) =>
  queryOptions({
    queryKey: ["auth", "signup", "getSignup", data],
    queryFn: ({ signal }) => getSignup({ data, signal }),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
