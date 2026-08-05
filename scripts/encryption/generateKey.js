import { bytesToHex } from "@noble/ciphers/utils.js";

const key = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
console.log(key);
