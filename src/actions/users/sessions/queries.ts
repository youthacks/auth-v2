import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Data } from "#/actions/types";
import { deleteSession, getSessions } from ".";

export const getSessionsQuery = (data: Data<typeof getSessions>) =>
  queryOptions({
    queryKey: ["users", data.id, "sessions"],
    queryFn: () => getSessions({ data }),
  });

export const deleteSessionMutation = () =>
  mutationOptions({
    mutationFn: (data: Data<typeof deleteSession>) => deleteSession({ data }),
  });
