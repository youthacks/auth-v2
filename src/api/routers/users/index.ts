import { deleteMeConsent, getConsents, getMeConsents } from "./consents";
import { getMe, updateMe } from "./me";
import { allUsers, getUser, updateUser } from "./users";

export const usersRouter = {
  all: allUsers,
  get: getUser,
  update: updateUser,

  consents: {
    get: getConsents,
  },

  me: {
    get: getMe,
    update: updateMe,
    consents: {
      get: getMeConsents,
      delete: deleteMeConsent,
    },
  },
};
