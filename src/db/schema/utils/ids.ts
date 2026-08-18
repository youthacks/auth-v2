import { customAlphabet } from "nanoid";

export const customId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
);

export const userId = () => `user:${customId(8)}`;
export const sessionId = () => `sess:${customId(32)}`;
export const applicationId = () => `app:${customId(8)}`;

export const loginId = () => customId(8);
export const signupId = () => customId(8);
export const verificationId = () => customId(32);
