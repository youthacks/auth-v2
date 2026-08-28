import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Data } from "../types";
import { getUser, listUsers, updateUser } from ".";

export const listUsersQuery = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => listUsers(),
  });

export const getUserQuery = (data: Data<typeof getUser>) =>
  queryOptions({
    queryKey: ["users", data.id],
    queryFn: () => getUser({ data }),
  });

export const updateUserMutation = () =>
  mutationOptions({
    mutationFn: (data: Data<typeof updateUser>) => updateUser({ data }),
  });
