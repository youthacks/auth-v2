import { os } from "@orpc/server";
import type { RequestHeadersHandlerPluginContext } from "@orpc/server/plugins";
import type { SessionContext } from "#/api/middleware/requireSession";

export interface ServerContext
  extends RequestHeadersHandlerPluginContext, Partial<SessionContext> {
  handler: "rpc" | "openapi";
}

export const base = os.$context<ServerContext>();
