import { bytea, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { applications } from "./applications";
import { sessions, users } from "./base";
import { createdAt, expiresAt } from "./utils/timestamps";

export const oauthExchangeCodes = pgTable("oauth_exchange_codes", {
  code: text().primaryKey(),
  scopes: text().notNull(),

  appId: text("app_id")
    .notNull()
    .references(() => applications.id, {
      onDelete: "cascade",
    }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  sessionId: text("session_id").references(() => sessions.id, {
    onDelete: "cascade",
  }),

  createdAt,
  expiresAt,
});

export const oauthAccessTokens = pgTable("oauth_access_tokens", {
  id: text().primaryKey(),
  secretHash: bytea("secret_hash").notNull(),
  scopes: text().notNull(),

  appId: text("app_id")
    .notNull()
    .references(() => applications.id, {
      onDelete: "cascade",
    }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  sessionId: text("session_id").references(() => sessions.id, {
    onDelete: "cascade",
  }),
  refreshTokenId: text("refresh_token")
    .notNull()
    .references(() => oauthRefreshTokens.id, { onDelete: "cascade" }),

  createdAt,
  expiresAt,
});

export const oauthRefreshTokens = pgTable("oauth_refresh_tokens", {
  id: text().primaryKey(),
  secretHash: bytea("secret_hash").notNull(),
  scopes: text().notNull(),

  appId: text("app_id")
    .notNull()
    .references(() => applications.id, {
      onDelete: "cascade",
    }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  sessionId: text("session_id").references(() => sessions.id, {
    onDelete: "cascade",
  }),

  authTime: timestamp("auth_time").notNull(),
  revokedAt: timestamp("revoked_at"),

  createdAt,
  expiresAt,
});
