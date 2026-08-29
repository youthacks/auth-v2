import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./base";
import { assetId } from "./utils/ids";
import { createdAt, updatedAt } from "./utils/timestamps";

export const assets = pgTable("assets", {
  id: text().primaryKey().$defaultFn(assetId),
  mime: text().notNull(),
  size: integer().notNull(),

  ownerId: text("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt,
  updatedAt,
});
