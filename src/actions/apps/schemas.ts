import z from "zod";

export const appSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string(),
  homepageUrl: z
    .httpUrl()
    .or(z.url({ protocol: /^http$/, hostname: /^localhost$/ })),
  logoAssetId: z.string().nullable(),
  backgroundAssetId: z.string().nullable(),
});
