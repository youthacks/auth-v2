import {
  blob,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import {
  loginId,
  sessionId,
  signupId,
  userId,
  verificationId,
} from "./utils/ids";
import { createdAt, expiresAt, updatedAt } from "./utils/timestamps";

export const users = sqliteTable(
  "users",
  {
    id: text().primaryKey().$defaultFn(userId),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    isLastNameFirst: integer("is_last_name_first", { mode: "boolean" })
      .notNull()
      .default(false),
    email: text().notNull().unique(),
    dateOfBirth: text("date_of_birth").notNull(),

    role: text({ enum: ["user", "admin"] })
      .notNull()
      .default("user"),

    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex("email_idx").on(t.email)],
);

export const sessions = sqliteTable("sessions", {
  id: text().primaryKey().$defaultFn(sessionId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  createdAt,
  expiresAt,
});

export const verifications = sqliteTable("verifications", {
  id: text().primaryKey().$defaultFn(verificationId),
  email: text().notNull(),
  code: text().notNull(),

  createdAt,
  expiresAt,
});

export const logins = sqliteTable("logins", {
  id: text().primaryKey().$defaultFn(loginId),
  verifierHash: blob("verifier_hash", { mode: "buffer" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  verificationId: text("verification_id").references(() => verifications.id, {
    onDelete: "set null",
  }),

  createdAt,
});

export const signups = sqliteTable("signups", {
  id: text().primaryKey().$defaultFn(signupId),
  verifierHash: blob("verifier_hash", { mode: "buffer" }).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text().notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  dateOfBirth: text("date_of_birth").notNull(),

  verificationId: text("verification_id").references(() => verifications.id, {
    onDelete: "set null",
  }),

  createdAt,
});
