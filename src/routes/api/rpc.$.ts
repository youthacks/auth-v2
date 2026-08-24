import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { apiRouter } from "#/api/routers";

const handler = new RPCHandler(apiRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      async ANY({ request }) {
        const { matched, response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: { handler: "rpc" },
        });
        if (matched) {
          return response;
        }

        return new Response("Not Found", { status: 404 });
      },
    },
  },
});
