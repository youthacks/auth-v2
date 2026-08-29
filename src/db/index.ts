import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(process.env.DATABASE_URL, {
  relations,
});
