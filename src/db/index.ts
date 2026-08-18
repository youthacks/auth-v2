import { drizzle } from "drizzle-orm/libsql";
import { relations } from "./relations";

export const db = drizzle(process.env.DATABASE_URL || "file:./dev.db", {
  relations,
});
