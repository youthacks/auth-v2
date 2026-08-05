import FormMessage from "#/components/form/FormMessage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/console/manage/apps/$id/add/saml")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8">
      <FormMessage state="info">
        SAML is not yet supported. Please use OAuth2 instead.
      </FormMessage>
    </div>
  );
}
