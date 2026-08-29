import { MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react";
import { useMemo } from "react";
import { UAParser } from "ua-parser-js";
import { browsers } from "./browsers";

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

export function parseUserAgent(
  userAgent: string | null | undefined,
): UserAgentData | null {
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
export function getSessionName(userAgent: string | null | undefined): string {
  const parsed = parseUserAgent(userAgent);

  if (parsed?.deviceName) return parsed.deviceName;
  if (parsed?.osName && parsed?.browserName) {
    return `${parsed.browserName} on ${parsed.osName}`;
  }

  return "[unknown]";
}

export function SessionIcon({ userAgent }: { userAgent: string | null }) {
  const parsed = parseUserAgent(userAgent);
  const DeviceIcon = useMemo(() => {
    switch (parsed?.type) {
      case "mobile":
        return SmartphoneIcon;
      case "tablet":
        return TabletIcon;
      default:
        return MonitorIcon;
    }
  }, [parsed?.type]);
  const browser = useMemo(() => {
    if (!parsed?.browserName) return null;

    // biome-ignore lint/style/noNonNullAssertion: tested above
    const browser = browsers.find((b) => b.regex.test(parsed.browserName!));
    return browser || null;
  }, [parsed?.browserName]);

  return (
    <div className="relative grid size-8 place-items-center rounded-sm border border-neutral-200 bg-neutral-100">
      <DeviceIcon className="size-4 text-neutral-600" />
      {browser && (
        <div className="absolute right-0.5 bottom-0.5">
          <img src={browser.src} alt={browser.name} className="size-3" />
        </div>
      )}
    </div>
  );
}
