import { queryOptions } from "@tanstack/react-query";
import { getAllApps, getAppById } from ".";

export const getAllAppsQuery = () =>
  queryOptions({
    queryKey: ["console", "manage", "apps", "getAllApps"],
    queryFn: ({ signal }) => getAllApps({ signal }),
  });

export const getAppByIdQuery = (data: { id: string }) =>
  queryOptions({
    queryKey: ["console", "manage", "apps", "getAppById", data],
    queryFn: ({ signal }) => getAppById({ data, signal }),
  });
