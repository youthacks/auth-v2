import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { users } from "#/db/schema/base";
import { requireSession } from "../auth/session/middleware";
import { withUser } from "./middleware";
import { userSchema } from "./schema";

export const listUsers = createServerFn()
  .middleware([requireSession])
  .handler(async ({ context }) => {
    if (context.user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const users = await db.query.users.findMany({
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        isLastNameFirst: true,
        email: true,
        createdAt: true,
      },
    });
    return users;
  });

export const getUser = createServerFn()
  .middleware([withUser])
  .handler(async ({ context }) => {
    return context.withUser;
  });

export const updateUser = createServerFn({ method: "POST" })
  .middleware([withUser])
  .validator(userSchema)
  .handler(async ({ context, data }) => {
    await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        isLastNameFirst: data.isLastNameFirst,
        dateOfBirth: data.dateOfBirth,
      })
      .where(eq(users.id, context.withUser.id));
  });
