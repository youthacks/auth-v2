import { timingSafeEqual } from "node:crypto";
import { createMiddleware } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import z from "zod";
import { db } from "#/db";
import sha256 from "#/lib/sha256";

export const requireLogin = createMiddleware({ type: "function" })
  .validator(
    z.looseObject({
      id: z.string(),
    }),
  )
  .server(async ({ data, next }) => {
    const login = await db.query.logins.findFirst({
      where: { id: data.id },
      with: { user: true },
    });
    if (!login) {
      throw new Error("Login not found");
    }

    const verifier = getCookie(`login_verifier_${data.id}`);
    const verifierHash = await sha256(verifier || "");
    if (!timingSafeEqual(verifierHash, login.verifierHash)) {
      throw new Error(
        "This login wasn't started on this device - please check you have cookies enabled.",
      );
    }

    return next({
      context: { login },
    });
  });
