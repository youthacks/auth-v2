import {
  Html,
  Head,
  Body,
  Container,
  Tailwind,
  pixelBasedPreset,
  Heading,
  Section,
  Text,
  Row,
  Column,
  Hr,
  Link,
  Preview,
} from "react-email";

export namespace VerifyEmail {
  export interface Props {
    firstName: string;
    email: string;
    code: string;

    deviceName?: string;
    expiresInMinutes?: number;
  }
}

export default function VerifyEmail(props: VerifyEmail.Props) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Html>
        <Head />
        <Body className="m-0 font-sans">
          <Preview>
            Here's the code to log in to your Youthacks account.
          </Preview>
          <Container className="mx-auto w-full max-w-[640px] p-8 text-left">
            <Text className="mt-0 mb-8 text-xl font-bold">Youthacks</Text>

            <Heading as="h1" className="m-0 text-xl font-bold">
              Hey {props.firstName}!
            </Heading>
            <Text className="mt-2 mb-0 text-base">
              Here's the code to log in to your Youthacks account:
            </Text>
            <Section className="my-6 text-center">
              <Row className="rounded-xl bg-neutral-100 px-4 py-8">
                <Column className="font-mono text-3xl font-bold tracking-[0.2em]">
                  {props.code}
                </Column>
              </Row>
              <Row className="mt-2">
                <Column className="text-xs text-neutral-400">
                  (double-click to copy!)
                </Column>
              </Row>
            </Section>
            <Text className="mt-4 mb-0 text-sm text-neutral-600">
              This code{" "}
              {props.deviceName ? (
                <>
                  is for{" "}
                  <b className="font-bold text-black">{props.deviceName}</b> and
                </>
              ) : null}{" "}
              expires in {props.expiresInMinutes ?? 15} minutes.
            </Text>
            <Text className="mt-2 mb-0 text-sm text-neutral-600">
              Didn't request this? You can safely ignore this email.
            </Text>

            <Hr className="my-8 border-neutral-200" />

            <Text className="mt-0 mb-0 text-sm font-bold">Youthacks</Text>
            <Text className="mt-1 mb-0 text-sm text-pretty text-neutral-600">
              We support and run hackathons for teens, and create safe spaces
              where young coders can thrive, together.
            </Text>
            <Text className="mt-1 mb-0 text-sm">
              <Link
                href="https://youthacks.org"
                className="text-rose-700 underline"
              >
                https://youthacks.org
              </Link>
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
VerifyEmail.PreviewProps = {
  firstName: "Joe",
  email: "joe@example.com",
  code: "123456",

  deviceName: "Chrome on Android",
} satisfies VerifyEmail.Props;
