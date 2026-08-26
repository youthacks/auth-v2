import { deleteMeConsent, getConsents, getMeConsents } from "./consents";
import { getMe, updateMe } from "./me";
import { deleteSession, getMeSessions, getSessions } from "./sessions";
import { allUsers, getUser, updateUser } from "./users";

export const usersRouter = {
  all: allUsers,
  get: getUser,
  update: updateUser,

  consents: {
    get: getConsents,
  },
  sessions: {
    get: getSessions,
    delete: deleteSession,
  },

  me: {
    get: getMe,
    update: updateMe,
    consents: {
      get: getMeConsents,
      delete: deleteMeConsent,
    },
    sessions: {
      get: getMeSessions,
    },
  },
};
