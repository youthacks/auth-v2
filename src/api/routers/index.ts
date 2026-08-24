import { appsRouter } from "./apps";
import { usersRouter } from "./users";

export { oauthRouter } from "./oauth";

export const apiRouter = {
  users: usersRouter,
  apps: appsRouter,
};
