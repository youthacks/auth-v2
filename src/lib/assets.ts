import path from "node:path";
import { Disk } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import { S3Driver } from "flydrive/drivers/s3";
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

const s3Driver = new S3Driver({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  bucket: process.env.BUCKET_NAME!,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || "auto",
  cdnUrl: process.env.AWS_CDN_URL,
  visibility: "public",
});

const disk = new Disk(
  process.env.NODE_ENV === "production" ? s3Driver : fsDriver,
);

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
  try {
    await disk.put(key, await file.bytes(), {
      visibility: "public",
    });
  } catch (e) {
    console.error("Error saving asset to disk:", e);
    throw e;
  }

  return id;
}

export async function getAssetUrl(id: string) {
  const [, key] = id.split(":");

  return disk.getUrl(key);
}
