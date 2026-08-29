import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { userAvatars, users } from "#/db/schema/base";
import { getAssetUrl } from "#/lib/assets";
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
      with: {
        avatar: {
          with: { asset: true },
        },
      },
    });

    return await Promise.all(
      users.map(async (user) => ({
        ...user,
        avatar: user.avatar
          ? {
              id: user.avatar.asset.id,
              url: await getAssetUrl(user.avatar.asset.id),
            }
          : null,
      })),
    );
  });

export const getUser = createServerFn()
  .middleware([withUser])
  .handler(async ({ context }) => {
    const avatar = await db.query.userAvatars.findFirst({
      where: { userId: context.withUser.id },
      with: {
        asset: true,
      },
    });
    const avatarPart = avatar
      ? { id: avatar.asset.id, url: await getAssetUrl(avatar.asset.id) }
      : null;

    return {
      ...context.withUser,
      avatar: avatarPart,
    };
  });

export const updateUser = createServerFn({ method: "POST" })
  .middleware([withUser])
  .validator(userSchema)
  .handler(async ({ context, data }) => {
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          isLastNameFirst: data.isLastNameFirst,
          dateOfBirth: data.dateOfBirth,
        })
        .where(eq(users.id, context.withUser.id));

      if (data.avatarAssetId) {
        await tx
          .insert(userAvatars)
          .values({
            userId: context.withUser.id,
            assetId: data.avatarAssetId,
          })
          .onConflictDoUpdate({
            target: userAvatars.userId,
            set: {
              assetId: data.avatarAssetId,
            },
          });
      } else {
        await tx
          .delete(userAvatars)
          .where(eq(userAvatars.userId, context.withUser.id));
      }
    });
  });
