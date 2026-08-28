import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Data } from "#/actions/types";
import { getAssetInfo, uploadAvatar } from ".";

export const getAssetInfoQuery = (data: Data<typeof getAssetInfo>) =>
  queryOptions({
    queryKey: ["assets", data.assetId],
    queryFn: () => getAssetInfo({ data }),
  });

export const uploadAvatarMutation = () =>
  mutationOptions({
    mutationFn: (data: FormData) => uploadAvatar({ data }),
  });
