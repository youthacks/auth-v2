import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/db";
import { requireSession } from "#/middleware/requireSession";
import { updateProfileSchema } from "./schemas";

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(updateProfileSchema)
  .handler(async ({ data, context }) => {
    await prisma.user.update({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
      },
      where: {
        id: context.session.userId,
      },
    });
  });
