import { os } from "@orpc/server";
import type { RequestHeadersHandlerPluginContext } from "@orpc/server/plugins";

interface ServerContext extends RequestHeadersHandlerPluginContext {}

export const base = os.$context<ServerContext>();
