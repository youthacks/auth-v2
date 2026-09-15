import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";
import { CheckIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import Button from "#/components/ui/Button";
import { testRedirectUrl } from "./callback/route";
import { useMutation } from "@tanstack/react-query";

interface UserInfoResponse {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  nickname: string;
  updated_at: number;
  picture?: string;
}

const loader = createServerFn().handler(async () => {
  const state = nanoid(32);
  setCookie("test_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  const providedState = getCookie("test_oauth_provided_state");
  const code = getCookie("test_exchange_code");
  const accessToken = getCookie("test_access_token");
  // biome-ignore lint/style/noNonNullAssertion: intentional
  const clientId = process.env.TEST_CLIENT_ID!;

  let user: UserInfoResponse | null = null;
  if (accessToken) {
    try {
      user = await fetch(`${import.meta.env.PUBLIC_URL}/oauth/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }).then((res) => res.json());
    } catch (_e) {}
  }

  return {
    state,
    clientId,
    code,
    providedState,
    accessToken,
    redirectUri: testRedirectUrl,
    user,
  };
});

const reset = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie("test_exchange_code");
  deleteCookie("test_access_token");
  deleteCookie("test_oauth_provided_state");
});

export const Route = createFileRoute("/test")({
  loader: async ({ abortController }) => {
    const data = await loader({ signal: abortController.signal });
    return data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const {
    state,
    clientId,
    redirectUri,
    providedState,
    accessToken,
    code,
    user,
  } = Route.useLoaderData();

  const router = useRouter();
  const resetMutation = useMutation({
    mutationFn: reset,
    onSuccess: async () => {
      await router.invalidate();
    },
  });

  const authoriseMutation = useMutation({
    mutationFn: async () => {
      const baseUrl = `${import.meta.env.PUBLIC_URL}/oauth/authorize`;
      const searchParams = new URLSearchParams({
        client_id: clientId,
        scope: scopes.join(" "),
        redirect_uri: redirectUri,
        state,
        response_type: "code",
      });

      location.href = `${baseUrl}?${searchParams.toString()}`;
      await new Promise(() => {}); // never resolves
    },
  });

  const [scopes, setScopes] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-3xl p-8">
      {user ? (
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-radial from-cyan-600 to-cyan-700"></div>
          <h1 className="font-heading text-3xl font-bold">You're logged in</h1>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-radial from-rose-600 to-rose-700"></div>
          <h1 className="font-heading text-3xl font-bold">
            You're not logged in
          </h1>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {user ? (
          <>
            <div className="flex">
              <div className="grid size-10 place-items-center border border-r-0 border-cyan-200 bg-cyan-100 text-cyan-600">
                <CheckIcon className="size-3" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1 border-x border-neutral-200 border-l-cyan-200">
                <div className="flex h-10 items-center border-y border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-medium">authorise app</p>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="grid size-10 place-items-center border border-r-0 border-neutral-200 bg-neutral-50">
                <span className="text-sm leading-none">2</span>
              </div>
              <div className="min-w-0 flex-1 border-x border-neutral-200">
                <div className="flex h-10 items-center border-y border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-medium">callback</p>
                </div>
                <div className="border-b border-neutral-200 p-3 px-4">
                  <p className="text-sm">
                    Youthacks Auth redirects back to your app, with an exchange
                    code.
                  </p>
                  <p className="mt-2 text-sm">
                    Here, you would check the state matches the original state -
                    for example by storing the original state in a browser
                    cookie beforehand, and checking it matches.
                  </p>
                </div>
                <div className="border-b border-neutral-200 bg-neutral-50 p-3 px-4 pb-4">
                  <p className="font-mono">{redirectUri}</p>
                  <p className="pl-4 font-mono">
                    ?<span className="text-neutral-600">code={code}</span>
                  </p>
                  <p className="pl-4 font-mono">
                    &
                    <span className="text-neutral-600">
                      state={providedState}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="grid size-10 place-items-center border border-r-0 border-neutral-200 bg-neutral-50">
                <span className="text-sm leading-none">3</span>
              </div>
              <div className="min-w-0 flex-1 border-x border-neutral-200">
                <div className="flex h-10 items-center border-y border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-medium">
                    exchange code → access token
                  </p>
                </div>
                <div className="border-b border-neutral-200 p-3 px-4">
                  <p className="text-sm font-medium text-rose-700">client ID</p>
                  <p className="mt-0.5 font-mono">client_id</p>
                  <p className="mt-1 text-xs text-pretty text-neutral-600">
                    the client ID for this app.
                  </p>
                </div>
                <div className="border-b border-neutral-200 p-3 px-4">
                  <p className="text-sm font-medium text-amber-700">
                    client secret
                  </p>
                  <p className="mt-0.5 font-mono">[secret]</p>
                  <p className="mt-1 text-xs text-pretty text-neutral-600">
                    the client secret for this app.{" "}
                    <span className="font-medium text-black">
                      this should be stored securely.
                    </span>
                  </p>
                </div>
                <div className="border-b border-neutral-200 p-3 px-4">
                  <p className="text-sm font-medium text-cyan-700">
                    redirect URI
                  </p>
                  <p className="mt-0.5 font-mono">{redirectUri}</p>
                  <p className="mt-1 text-xs text-pretty text-neutral-600">
                    the same redirect URI as before.
                  </p>
                </div>
                <div className="border-b border-neutral-200 p-3 px-4">
                  <p className="text-sm font-medium text-neutral-600">code</p>
                  <p className="mt-0.5 font-mono">{code}</p>
                  <p className="mt-1 text-xs text-pretty text-neutral-600">
                    the exchange code you received.
                  </p>
                </div>
                <div className="border-b border-neutral-200 bg-neutral-50 p-3 px-4 pb-4">
                  <p className="font-mono">
                    <span className="text-purple-700">POST</span>{" "}
                    {import.meta.env.PUBLIC_URL}/oauth/token
                  </p>
                  <p className="pl-10 font-mono">
                    ?<span className="text-rose-700">client_id={clientId}</span>
                  </p>
                  <p className="pl-10 font-mono">
                    &
                    <span className="text-amber-700">
                      client_secret=[secret]
                    </span>
                  </p>
                  <p className="pl-10 font-mono">
                    &
                    <span className="text-cyan-700">
                      redirect_uri={redirectUri}
                    </span>
                  </p>
                  <p className="pl-10 font-mono">
                    &<span className="text-neutral-600">code={code}</span>
                  </p>
                  <p className="pl-10 font-mono">
                    &grant_type=authorization_code
                  </p>

                  <p className="mt-4 font-mono">200 OK</p>
                  <p className="font-mono">{"{"}</p>
                  <p className="pl-6 font-mono text-purple-700">
                    "access_token": "{accessToken}",
                  </p>
                  <p className="pl-6 font-mono text-neutral-600">
                    "token_type": "Bearer",
                  </p>
                  <p className="pl-6 font-mono text-neutral-600">
                    "expires_in": 15778800,
                  </p>
                  <p className="pl-6 font-mono text-neutral-600">
                    "refresh_token": "ythrf.abcdefgh12345678...",
                  </p>
                  <p className="pl-6 font-mono text-neutral-600">
                    "scope": "[scopes]",
                  </p>
                  <p className="font-mono">{"}"}</p>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="grid size-10 place-items-center border border-r-0 border-neutral-200 bg-neutral-50">
                <span className="text-sm leading-none">4</span>
              </div>
              <div className="min-w-0 flex-1 border-x border-neutral-200">
                <div className="flex h-10 items-center border-y border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-medium">get user info</p>
                </div>
                <div className="border-b border-neutral-200 p-3 px-4">
                  <p className="text-sm font-medium text-purple-700">
                    access token
                  </p>
                  <p className="mt-0.5 font-mono">{accessToken}</p>
                </div>
                <div className="border-b border-neutral-200 bg-neutral-50 p-3 px-4 pb-4">
                  <p className="font-mono">
                    <span className="text-cyan-700">GET</span>{" "}
                    {import.meta.env.PUBLIC_URL}/oauth/userinfo
                  </p>
                  <p className="font-mono">
                    Authorization: Bearer{" "}
                    <span className="text-purple-700">{accessToken}</span>
                  </p>

                  <p className="mt-4 font-mono">200 OK</p>
                  <p className="font-mono whitespace-pre-wrap">
                    {JSON.stringify(user, null, 2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="grid size-10 place-items-center border border-r-0 border-neutral-200 bg-neutral-50">
                <span className="text-sm leading-none">5</span>
              </div>
              <div className="min-w-0 flex-1 border-x border-neutral-200">
                <div className="flex h-10 items-center border-y border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-medium">
                    look it's a {user.given_name}!
                  </p>
                </div>
                <div className="flex items-center gap-4 border-b border-neutral-200 p-4">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt=""
                      className="size-16 flex-none rounded-full shadow-sm"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm">{user.email}</p>
                    <p className="mt-0.5 font-mono text-xs text-neutral-600">
                      {user.sub}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex">
            <div className="grid size-10 place-items-center border border-r-0 border-neutral-200 bg-neutral-50">
              <span className="text-sm leading-none">1</span>
            </div>
            <div className="min-w-0 flex-1 border-x border-neutral-200">
              <div className="flex h-10 items-center border-y border-neutral-200 bg-neutral-50 p-4">
                <p className="text-sm font-medium">authorise app</p>
              </div>
              <div className="border-b border-neutral-200 p-3 px-4">
                <p className="text-sm font-medium text-rose-700">client ID</p>
                <p className="mt-0.5 font-mono">{clientId}</p>
                <p className="mt-1 text-xs text-pretty text-neutral-600">
                  the client ID for this app.
                </p>
              </div>
              <div className="border-b border-neutral-200 p-3 px-4">
                <p className="text-sm font-medium text-lime-700">scopes</p>
                <div className="mt-1.5 space-y-1">
                  {["profile", "email", "birthdate"].map((scope) => (
                    <label key={scope} className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={scopes.includes(scope)}
                        onChange={(e) => {
                          setScopes((prev) =>
                            e.target.checked
                              ? [...prev, scope]
                              : prev.filter((s) => s !== scope),
                          );
                        }}
                        className="size-4 accent-lime-600"
                      />
                      <span>{scope}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-pretty text-neutral-600">
                  permissions to request.
                </p>
              </div>
              <div className="border-b border-neutral-200 p-3 px-4">
                <p className="text-sm font-medium text-cyan-700">
                  redirect URI
                </p>
                <p className="mt-0.5 font-mono">{redirectUri}</p>
                <p className="mt-1 text-xs text-pretty text-neutral-600">
                  where to redirect the user back to once they've logged in.
                </p>
              </div>
              <div className="border-b border-neutral-200 p-3 px-4">
                <p className="text-sm font-medium text-neutral-600">state</p>
                <p className="mt-0.5 font-mono">{state}</p>
                <p className="mt-1 text-xs text-pretty text-neutral-600">
                  a random value to prevent CSRF attacks. when the user is
                  redirected back to the callback URL, this state is included.
                </p>
              </div>
              <div className="border-b border-neutral-200 bg-neutral-50 p-3 px-4 pb-4">
                <p className="font-mono">
                  <span className="text-cyan-700">GET</span>{" "}
                  {import.meta.env.PUBLIC_URL}/oauth/authorize
                </p>
                <p className="pl-8 font-mono">
                  ?<span className="text-rose-700">client_id={clientId}</span>
                </p>
                <p className="pl-8 font-mono">
                  &
                  <span className="text-lime-700">
                    scope={scopes.join("+") || "[scopes]"}
                  </span>
                </p>
                <p className="pl-8 font-mono">
                  &
                  <span className="text-cyan-700">
                    redirect_uri={redirectUri}
                  </span>
                </p>
                <p className="pl-8 font-mono">
                  &<span className="text-neutral-600">state={state}</span>
                </p>
                <p className="pl-8 font-mono">&response_type=code</p>
                <Button
                  color="primary"
                  onClick={() => authoriseMutation.mutate()}
                  disabled={scopes.length === 0 || authoriseMutation.isPending}
                  className="peer mt-3"
                >
                  authorise
                </Button>
                {scopes.length === 0 && (
                  <p className="mt-2 text-xs text-neutral-600">
                    pick some scopes above!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {user && (
        <div className="mt-6">
          <p className="text-neutral-600">again! again!</p>
          <Button
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
            className="mt-2"
          >
            start again
          </Button>
        </div>
      )}
    </div>
  );
}
