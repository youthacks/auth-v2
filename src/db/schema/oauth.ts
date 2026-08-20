import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { applications } from "./applications";
import { sessions, users } from "./base";
import { createdAt, expiresAt } from "./utils/timestamps";

export const oauthExchangeCodes = sqliteTable("oauth_exchange_codes", {
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

export const oauthAccessTokens = sqliteTable("oauth_access_tokens", {
  id: text().primaryKey(),
  secretHash: blob("secret_hash", { mode: "buffer" }).notNull(),
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

export const oauthRefreshTokens = sqliteTable("oauth_refresh_tokens", {
  id: text().primaryKey(),
  secretHash: blob("secret_hash", { mode: "buffer" }).notNull(),
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

  authTime: integer("auth_time", { mode: "timestamp" }).notNull(),
  revokedAt: integer("revoked_at", { mode: "timestamp" }),

  createdAt,
  expiresAt,
});
