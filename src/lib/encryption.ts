import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { hexToBytes, managedNonce } from "@noble/ciphers/utils.js";
import defined from "./defined";

export { bytesToHex, hexToBytes, randomBytes } from "@noble/ciphers/utils.js";

const encryptionKeys = [
  hexToBytes(
    defined("ENCRYPTION_SECRET_NEW", process.env.ENCRYPTION_SECRET_NEW),
  ),
];

export function encrypt(
  data: string | Uint8Array<ArrayBuffer>,
): Uint8Array<ArrayBuffer> {
  if (typeof data === "string") {
    data = new TextEncoder().encode(data);
  }

  const key = encryptionKeys[0];
  const xchacha = managedNonce(xchacha20poly1305)(key);
  return xchacha.encrypt(data);
}

export function decrypt(
  data: Uint8Array<ArrayBufferLike>,
  as: "string",
): string;
export function decrypt(
  data: Uint8Array<ArrayBufferLike>,
  as?: "bytes",
): Uint8Array<ArrayBuffer>;
export function decrypt(
  data: Uint8Array<ArrayBufferLike>,
  as: "string" | "bytes" = "bytes",
): string | Uint8Array<ArrayBuffer> {
  for (const key of encryptionKeys) {
    const xchacha = managedNonce(xchacha20poly1305)(key);
    try {
      const decrypted = xchacha.decrypt(data);
      if (as === "string") {
        return new TextDecoder().decode(decrypted);
      }
      return decrypted;
    } catch (_e) {
      // Ignore error and try next key
    }
  }
  throw new Error("Failed to decrypt data with any key");
}
