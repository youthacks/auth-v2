import { os } from "@orpc/server";
import type { RequestHeadersHandlerPluginContext } from "@orpc/server/plugins";

export interface ServerContext extends RequestHeadersHandlerPluginContext {
  handler: "rpc" | "openapi";
}

export const base = os.$context<ServerContext>();
