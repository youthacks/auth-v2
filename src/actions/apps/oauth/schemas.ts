import z from "zod";

const zAllowedCallbackUrls = () =>
  z.string().transform((val, ctx) => {
    const urls = val
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
    if (urls.length === 0) {
      ctx.addIssue({
        code: "too_small",
        origin: "array",
        minimum: 1,
        message: "At least one callback URL is required",
      });
    }

    for (const url of urls) {
      try {
        z.url({
          protocol: /^https$/,
          hostname: z.regexes.domain,
        }).parse(url);
      } catch (_e) {
        try {
          z.url({
            protocol: /^http$/,
            hostname: /^localhost$/,
          }).parse(url);
        } catch (_e) {
          ctx.addIssue({
            code: "invalid_format",
            format: "url",
            message: `Invalid URL format: ${url}`,
          });
        }
      }
    }

    return urls;
  });

export const appOAuthSchema = z.object({
  allowedCallbackUrls: zAllowedCallbackUrls(),
});
