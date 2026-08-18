import { timingSafeEqual } from "node:crypto";
import { createMiddleware } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import z from "zod";
import { db } from "#/db";
import sha256 from "#/lib/sha256";

export const requireSignup = createMiddleware({ type: "function" })
  .validator(
    z.looseObject({
      id: z.string(),
    }),
  )
  .server(async ({ data, next }) => {
    const signup = await db.query.signups.findFirst({
      where: { id: data.id },
    });
    if (!signup) {
      throw new Error("Signup not found");
    }

    const verifier = getCookie(`signup_verifier_${data.id}`);
    const verifierHash = await sha256(verifier || "");
    if (!timingSafeEqual(verifierHash, signup.verifierHash)) {
      throw new Error(
        "This signup wasn't started on this device - please check you have cookies enabled.",
      );
    }

    return next({
      context: { signup },
    });
  });
