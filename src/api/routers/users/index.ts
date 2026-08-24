import { getMe, updateMe } from "./me";

export const usersRouter = {
  me: {
    get: getMe,
    update: updateMe,
  },
};
