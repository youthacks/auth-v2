import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Data } from "#/actions/types";
import { createOAuthConfig, getOAuthConfig, updateOAuthConfig } from ".";

export const getOAuthConfigQuery = (data: Data<typeof getOAuthConfig>) =>
  queryOptions({
    queryKey: ["apps", data.id, "oauth"],
    queryFn: () => getOAuthConfig({ data }),
  });

export const createOAuthConfigMutation = () =>
  mutationOptions({
    mutationFn: (data: Data<typeof createOAuthConfig>) =>
      createOAuthConfig({ data }),
  });

export const updateOAuthConfigMutation = () =>
  mutationOptions({
    mutationFn: (data: Data<typeof updateOAuthConfig>) =>
      updateOAuthConfig({ data }),
  });
