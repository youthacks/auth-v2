import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { users } from "#/db/schema/base";
import { requireSession } from "#/middleware/requireSession";
import { updateProfileSchema } from "./schemas";

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(updateProfileSchema)
  .handler(async ({ data, context }) => {
    await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
      })
      .where(eq(users.id, context.user.id));
  });
