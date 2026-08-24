import { allApps, createApp, getApp, updateApp } from "./apps";
import { createOAuth, getOAuth, updateOAuth } from "./oauth";

export const appsRouter = {
  get: getApp,
  all: allApps,
  create: createApp,
  update: updateApp,

  oauth: {
    get: getOAuth,
    create: createOAuth,
    update: updateOAuth,
  },
};
