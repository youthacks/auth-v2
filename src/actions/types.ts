// biome-ignore lint/suspicious/noExplicitAny: expected to be any
export type Data<ServerFn extends (opts: { data: any }) => any> =
  Parameters<ServerFn>[0]["data"];
