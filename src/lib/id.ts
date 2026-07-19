import { customAlphabet } from "nanoid";

export const customId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8,
);

export const genUserId = () => `u:${customId()}`;
export const genLoginId = () => `la:${customId()}`;
export const genSignupId = () => `sa:${customId()}`;

export const genSessionId = () => `s:${customId(32)}`;
export const genVerificationId = () => `v:${customId(32)}`;
