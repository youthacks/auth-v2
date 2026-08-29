import path from "node:path";
import { Disk } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import { db } from "#/db";
import { assets } from "#/db/schema/assets";

const fsDriver = new FSDriver({
  location: path.join(process.cwd(), "public/uploads"),
  visibility: "public",
  urlBuilder: {
    async generateURL(key, _filePath) {
      return `${import.meta.env.PUBLIC_URL}/uploads/${key}`;
    },
  },
});

const disk = new Disk(fsDriver);

export async function saveAsset(file: File, { ownerId }: { ownerId: string }) {
  const [{ id }] = await db
    .insert(assets)
    .values({
      mime: file.type,
      size: file.size,
      ownerId,
    })
    .returning({ id: assets.id });

  const [, key] = id.split(":");
  await disk.put(key, await file.bytes());

  return id;
}

export async function getAssetUrl(id: string) {
  const [, key] = id.split(":");
  return disk.getUrl(key);
}
