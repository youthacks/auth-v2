import { OpenAPIHandler } from "@orpc/openapi/fetch";
import {
  CORSHandlerPlugin,
  RequestHeadersHandlerPlugin,
} from "@orpc/server/plugins";
import { createFileRoute } from "@tanstack/react-router";
import { oauthRouter } from "#/api/routers";

const handler = new OpenAPIHandler(oauthRouter, {
  plugins: [new CORSHandlerPlugin(), new RequestHeadersHandlerPlugin()],
});

export const Route = createFileRoute("/_auth/oauth/$")({
  server: {
    handlers: {
      async ANY({ request }) {
        const { matched, response } = await handler.handle(request, {
          prefix: "/oauth",
          context: { handler: "openapi" },
        });
        if (matched) {
          return response;
        }

        return new Response("Not Found", { status: 404 });
      },
    },
  },
});
