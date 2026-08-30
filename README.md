# auth-v2

An auth system for Youthacks attendees and organisers.

<table>
  <tr>
    <td>
      <img width="1920" height="1279" alt="" src="https://github.com/user-attachments/assets/749ed979-e65a-4c19-a2df-7ce7741177c0" />
    </td>
    <td>
      <img width="1920" height="1279" alt="" src="https://github.com/user-attachments/assets/b754765c-73a0-469c-948b-15899da9ae9e" />
    </td>
  </tr>
</table>

> [!WARNING]
> This was made partly for ~~fun~~ learning, and is still a work-in-progress. If you want something that's more advanced, customisable, and/or secure, you should check out other open-source projects! Some examples are Zitadel, Authentik and Authelia.

### What it can do
- Log in with email OTP
- Sign up with email OTP
- Self-service user management, including profile, avatar upload, sessions, and external app permissions
- Self-service external app management
- Sign in to external apps with OAuth2*
- Look really pretty 💖

_*this is not fully complete, but it is somewhat spec-compliant and does work with standard libraries, like better-auth!_

## Getting started

To run the app, first copy _.env.example_ to _.env.local_ and edit the variables with a `[!]`, including your Postgres database.

> [!TIP]
> To spin up a Postgres database locally, copy  _docker-compose.example.yml_ to _docker-compose.yml_ and generate a new password.
> 
> Then (with Docker installed), run `docker compose up -d`

After, you can install dependencies, migrate the database, and start the local dev server:

```bash
pnpm install
pnpm db:push
pnpm dev
```

## Building For Production

To build the app for production, run:

```bash
pnpm build
```

## Made with
- TanStack Start
- React + Tailwind CSS
- Drizzle ORM
- Elysia (oauth api)
- React Email (email templates)
