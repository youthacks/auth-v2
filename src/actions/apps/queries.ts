import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Data } from "#/actions/types";
import { createApp, getApp, listApps, updateApp } from ".";

export const listAppsQuery = () =>
  queryOptions({
    queryKey: ["apps"],
    queryFn: () => listApps(),
  });

export const getAppQuery = (data: Data<typeof getApp>) =>
  queryOptions({
    queryKey: ["apps", data.id],
    queryFn: () => getApp({ data }),
  });

export const createAppMutation = () =>
  mutationOptions({
    mutationFn: (data: Data<typeof createApp>) => createApp({ data }),
  });

export const updateAppMutation = () =>
  mutationOptions({
    mutationFn: (data: Data<typeof updateApp>) => updateApp({ data }),
  });
