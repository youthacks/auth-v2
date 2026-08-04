import { customAlphabet } from "nanoid";

export const customId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8,
);

export const genUserId = () => `user:${customId()}`;
export const genSessionId = () => `sess:${customId(32)}`;
export const genAppId = () => `app:${customId()}`;

export const genLoginId = () => customId();
export const genSignupId = () => customId();
export const genVerificationId = () => customId(32);
