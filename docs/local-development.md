# Local Development

## Prerequisites

- Node.js 24.18.0 or newer within major version 24.
- The pnpm version declared in the root `package.json`.
- Java 21 or newer for Firestore Emulator tests.

Run `pnpm install`, copy `.env.example` to `.env`, and configure a development
Firebase project. Keep production credentials and data out of local experiments.
Restart the development processes after changing environment variables.

## Firebase

1. Create a development project and enable Authentication and Cloud Firestore.
2. Register a web app. Copy its configuration into the four `VITE_FIREBASE_*`
   variables in `.env`.
3. Set `FIREBASE_PROJECT_ID`. Configure server credentials using either
   `GOOGLE_APPLICATION_CREDENTIALS` (a local service-account JSON file path) or
   `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`.
4. Deploy the repository's Firestore rules and indexes to that project:

```sh
pnpm exec firebase login
pnpm exec firebase deploy --only firestore:rules,firestore:indexes --project <development-project-id>
```

Never commit `.env` or service-account files. Variables prefixed with `VITE_`
are public browser configuration, not a place for server secrets.

## Platform OAuth

Configure the platforms you will test; the variable names and local defaults
are listed in `.env.example`.

| Provider | Local server callback | Settings |
| --- | --- | --- |
| Chzzk | `http://localhost:3000/api/auth/chzzk/callback` | `CHZZK_CLIENT_ID`, `CHZZK_CLIENT_SECRET`, `CHZZK_REDIRECT_URI` |
| Twitch | `http://localhost:3000/api/auth/twitch/callback` | `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `TWITCH_REDIRECT_URI` |
| Lichess | `http://localhost:3000/api/auth/lichess/callback` | `LICHESS_CLIENT_ID`, `LICHESS_REDIRECT_URI` |

Register the matching callbacks with the provider where applicable. Twitch
identity linking and streamer chat authorization share one callback; streamer
authorization requests `openid user:read:chat`. Lichess uses PKCE without a
client secret.

Generate separate encryption keys for `CHZZK_TOKEN_ENCRYPTION_KEY` and
`TWITCH_TOKEN_ENCRYPTION_KEY`:

```sh
openssl rand -base64 32
```

Keep the keys stable while encrypted tokens exist. Changing an application or
encryption key does not make its old stored tokens usable with the new settings.

Chess.com linking does not require an OAuth client. Ownership is verified with
a one-time code in the user's profile Location. Set `CHESS_COM_USER_AGENT` to
identify the service and a contact address.

## Run and Verify

```sh
pnpm dev
```

Open http://localhost:5173. Fastify listens on port 3000; Vite forwards API and
SSE requests to it. Use Ctrl+C to stop the development processes.

The streamer page is `/streamer`, account linking is `/viewer`, and a generated
browser-source URL uses `/overlay/:publicToken`. Treat that URL as a secret.

`GET /health` checks the running server. The authenticated
`GET /api/firebase/status` endpoint checks Firebase connectivity.

For administrator access, add your Firebase UID to `ADMIN_FIREBASE_UIDS`,
restart Fastify, sign in, and open `/admin`.

## Checks

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm test:emulator
pnpm build
```

Emulator tests start and stop a local Firestore Emulator using
`demo-elobadge-emulator`. They do not load production credentials from `.env`.
