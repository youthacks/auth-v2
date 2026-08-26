import { UAParser } from "ua-parser-js";

type DeviceType = "mobile" | "tablet" | "desktop";
function mapDeviceType(type: UAParser.DeviceTypes | undefined): DeviceType {
  switch (type) {
    case "mobile":
    case "tablet":
      return type;
    default:
      return "desktop";
  }
}

interface UserAgentData {
  type: DeviceType;
  browserName?: string;
  osName?: string;
  deviceName?: string;
}

export function parseUserAgent(userAgent: string | null): UserAgentData | null {
  if (!userAgent) return null;

  const { browser, os, device } = new UAParser(userAgent).getResult();
  return {
    type: mapDeviceType(device.type),
    browserName: browser.name,
    osName: os.name,
    deviceName:
      [device.vendor, device.model].filter(Boolean).join(" ") || undefined,
  };
}
export function getSessionName(userAgent: string | null): string {
  const parsed = parseUserAgent(userAgent);

  if (parsed?.deviceName) return parsed.deviceName;
  if (parsed?.osName && parsed?.browserName) {
    return `${parsed.browserName} on ${parsed.osName}`;
  }

  return "[unknown]";
}
