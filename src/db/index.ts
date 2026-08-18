import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { drizzle } from "drizzle-orm/libsql";
import { PrismaClient } from "../generated/prisma/client.js";
import { relations } from "./relations";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export const db = drizzle(process.env.DRIZZLE_DATABASE_URL || "file:./dev.db", {
  relations,
});
