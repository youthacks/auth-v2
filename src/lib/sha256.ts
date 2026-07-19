export default async function sha256(text: string) {
  const encoded = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return new Uint8Array(buffer);
}
