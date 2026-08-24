import { getMe, updateMe } from "./me";
import { allUsers, getUser } from "./users";

export const usersRouter = {
  all: allUsers,
  get: getUser,

  me: {
    get: getMe,
    update: updateMe,
  },
};
