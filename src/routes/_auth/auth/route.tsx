import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_auth/auth")({
  validateSearch: z.object({
    return_to: z.string().optional(),
  }),
  search: {
    middlewares: [retainSearchParams(["return_to"])],
  },
});
