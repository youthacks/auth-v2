import { resolveMx } from "node:dns/promises";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function verifyMxRecord(email: string): Promise<boolean> {
  const domain = email.split("@")[1];

  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch (error) {
    console.error(`Failed to resolve MX records for domain ${domain}:`, error);
    return false;
  }
}
