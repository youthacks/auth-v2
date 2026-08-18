import { blob, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./base";
import { applicationId } from "./utils/ids";
import { createdAt, updatedAt } from "./utils/timestamps";

export const applications = sqliteTable("applications", {
  id: text().primaryKey().$defaultFn(applicationId),
  name: text().notNull(),
  description: text(),
  homepageUrl: text("homepage_url").notNull(),

  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),

  createdAt,
  updatedAt,
});

export const applicationOAuthConfig = sqliteTable(
  "application_oauth2_configs",
  {
    appId: text("app_id")
      .primaryKey()
      .references(() => applications.id, {
        onDelete: "cascade",
      }),
    clientSecretEnc: blob("client_secret_enc").notNull(),
    allowedCallbackUrls: text("allowed_callback_urls").notNull(),

    createdAt,
    updatedAt,
  },
);

export const applicationConsents = sqliteTable(
  "application_consents",
  {
    appId: text("app_id").references(() => applications.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    scopes: text().notNull(),

    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.appId, t.userId] })],
);
