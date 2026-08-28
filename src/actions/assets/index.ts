import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "#/db";
import { getAssetUrl, saveAsset } from "#/lib/assets";
import { requireSession } from "../auth/session/middleware";

const formData = <T extends z.ZodObject>(schema: T) => {
  return z.preprocess((data) => {
    if (data instanceof FormData) {
      const obj = Object.fromEntries(data.entries());
      return obj;
    }
    return data;
  }, schema);
};

export const uploadAvatar = createServerFn({ method: "POST" })
  .middleware([requireSession])
  .validator(
    formData(
      z.object({
        file: z
          .file()
          .mime(["image/png", "image/jpeg"], "File must be a PNG or JPEG image")
          .max(5_000_000, "File must be less than 5MB"),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const assetId = await saveAsset(data.file, { ownerId: context.user.id });
    return { assetId };
  });

export const getAssetInfo = createServerFn()
  .validator(
    z.object({
      assetId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const asset = await db.query.assets.findFirst({
      where: { id: data.assetId },
    });
    if (!asset) {
      throw new Error("Asset not found");
    }

    const url = await getAssetUrl(asset.id);
    return {
      id: asset.id,
      mime: asset.mime,
      size: asset.size,
      url,
    };
  });
