import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { getCookie, setCookie } from "@tanstack/react-start/server";

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

export const testRedirectUrl = `${import.meta.env.PUBLIC_URL}/test/callback`;

export const Route = createFileRoute("/test/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const storedState = getCookie("test_oauth_state");

        const search = new URL(request.url).searchParams;
        const state = search.get("state");
        const code = search.get("code");
        if (!state || !code || !storedState || state !== storedState) {
          throw redirect({
            to: "/test",
            search: { auth_error: "Invalid request" },
          });
        }

        try {
          const { access_token }: TokenResponse = await fetch(
            `${import.meta.env.PUBLIC_URL}/oauth/token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                client_id: process.env.TEST_CLIENT_ID,
                client_secret: process.env.TEST_CLIENT_SECRET,
                redirect_uri: testRedirectUrl,
                code,
                grant_type: "authorization_code",
              }),
            },
          ).then((res) => res.json());

          setCookie("test_oauth_provided_state", state, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
          setCookie("test_exchange_code", code, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
          setCookie("test_access_token", access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
        } catch (_e) {
          if (isRedirect(_e)) {
            throw _e;
          }

          console.error(_e);
          throw redirect({
            to: "/",
            search: { auth_error: "Internal error" },
          });
        }

        throw redirect({ to: "/test" });
      },
    },
  },
});
