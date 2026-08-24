import { getMe, updateMe } from "./me";
import { allUsers, getUser, updateUser } from "./users";

export const usersRouter = {
  all: allUsers,
  get: getUser,
  update: updateUser,

  me: {
    get: getMe,
    update: updateMe,
  },
};
