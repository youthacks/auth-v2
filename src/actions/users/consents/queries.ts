import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Data } from "#/actions/types";
import { deleteConsent, getConsents } from ".";

export const getConsentsQuery = (data: Data<typeof getConsents>) =>
  queryOptions({
    queryKey: ["users", data.id, "consents"],
    queryFn: () => getConsents({ data }),
  });

export const deleteConsentMutation = () =>
  mutationOptions({
    mutationFn: (data: Data<typeof deleteConsent>) => deleteConsent({ data }),
  });
