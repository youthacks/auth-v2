import { defineConfig } from "drizzle-kit";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile("./.env.local");
} catch (_e) {}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
