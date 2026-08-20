import { defineRelations } from "drizzle-orm";
import * as applications from "./schema/applications";
import * as base from "./schema/base";
import * as oauth from "./schema/oauth";

export const relations = defineRelations(
  {
    ...applications,
    ...base,
    ...oauth,
  },
  (r) => ({
    users: {
      sessions: r.many.sessions(),
      appConsents: r.many.applicationConsents(),
    },
    sessions: {
      user: r.one.users({
        from: r.sessions.userId,
        to: r.users.id,
        optional: false,
      }),
    },

    logins: {
      user: r.one.users({
        from: r.logins.userId,
        to: r.users.id,
        optional: false,
      }),
      verification: r.one.verifications({
        from: r.logins.verificationId,
        to: r.verifications.id,
      }),
    },
    signups: {
      verification: r.one.verifications({
        from: r.signups.verificationId,
        to: r.verifications.id,
      }),
    },

    applications: {
      oauthConfig: r.one.applicationOAuthConfig({
        from: r.applications.id,
        to: r.applicationOAuthConfig.appId,
      }),
      owner: r.one.users({
        from: r.applications.ownerId,
        to: r.users.id,
        optional: false,
      }),
    },
    applicationConsents: {
      app: r.one.applications({
        from: r.applicationConsents.appId,
        to: r.applications.id,
        optional: false,
      }),
      user: r.one.users({
        from: r.applicationConsents.userId,
        to: r.users.id,
        optional: false,
      }),
    },

    oauthExchangeCodes: {
      app: r.one.applications({
        from: r.oauthExchangeCodes.appId,
        to: r.applications.id,
        optional: false,
      }),
    },
    oauthAccessTokens: {
      session: r.one.sessions({
        from: r.oauthAccessTokens.sessionId,
        to: r.sessions.id,
      }),
      user: r.one.users({
        from: r.oauthAccessTokens.userId,
        to: r.users.id,
        optional: false,
      }),
    },
    oauthRefreshTokens: {
      app: r.one.applications({
        from: r.oauthRefreshTokens.appId,
        to: r.applications.id,
        optional: false,
      }),
    },
  }),
);
