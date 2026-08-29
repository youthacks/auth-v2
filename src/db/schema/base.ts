import {
  boolean,
  bytea,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { assets } from "./assets";
import {
  loginId,
  sessionId,
  signupId,
  userId,
  verificationId,
} from "./utils/ids";
import { createdAt, expiresAt, updatedAt } from "./utils/timestamps";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: text().primaryKey().$defaultFn(userId),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    isLastNameFirst: boolean("is_last_name_first").notNull().default(false),
    email: text().notNull().unique(),
    dateOfBirth: text("date_of_birth").notNull(),

    role: userRole().notNull().default("user"),

    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex("email_idx").on(t.email)],
);
export const userAvatars = pgTable("user_avatars", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
});

export const sessions = pgTable("sessions", {
  id: text().primaryKey().$defaultFn(sessionId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  createdAt,
  expiresAt,
});

export const verifications = pgTable("verifications", {
  id: text().primaryKey().$defaultFn(verificationId),
  email: text().notNull(),
  code: text().notNull(),

  createdAt,
  expiresAt,
});

export const logins = pgTable("logins", {
  id: text().primaryKey().$defaultFn(loginId),
  verifierHash: bytea("verifier_hash").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  verificationId: text("verification_id").references(() => verifications.id, {
    onDelete: "set null",
  }),

  createdAt,
});

export const signups = pgTable("signups", {
  id: text().primaryKey().$defaultFn(signupId),
  verifierHash: bytea("verifier_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text().notNull(),
  emailVerified: boolean("email_verified").default(false),
  dateOfBirth: text("date_of_birth").notNull(),

  verificationId: text("verification_id").references(() => verifications.id, {
    onDelete: "set null",
  }),

  createdAt,
});
