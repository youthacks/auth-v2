import { queryOptions } from "@tanstack/react-query";
import { getAppOAuth2Config } from ".";

export const getAppOAuth2ConfigQuery = (data: { id: string }) =>
  queryOptions({
    queryKey: [
      "console",
      "manage",
      "apps",
      "oauth2",
      "getAppOAuth2Config",
      data,
    ],
    queryFn: ({ signal }) => getAppOAuth2Config({ data, signal }),
  });
