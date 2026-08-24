import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient, type RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { apiRouter } from "./routers";

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(apiRouter, {
      context: async () => ({
        handler: "rpc",
        reqHeaders: getRequestHeaders(),
      }),
    }),
  )
  .client((): RouterClient<typeof apiRouter> => {
    const link = new RPCLink({
      url: "/api/rpc",
    });

    return createORPCClient(link);
  });

export const client: RouterClient<typeof apiRouter> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
