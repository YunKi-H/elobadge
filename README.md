# EloBadge

Chess rating chat overlays for Chzzk and Twitch, with Chess.com and Lichess
account linking. Works as a browser source in OBS Studio, XSplit, and other
broadcasting software.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Fastify, TypeScript, Node.js
- Database and authentication: Cloud Firestore, Firebase Authentication
- Realtime: SSE from the server to overlays
- Deployment: Docker Compose and Caddy on Amazon Lightsail

The browser uses Firebase for authentication and calls Fastify for application
data. Only the server accesses Firestore through the Firebase Admin SDK.

## Repository

```text
apps/web/       Dashboard and browser-source overlay
apps/server/    API, chat collectors, SSE, and background jobs
packages/core/  Shared types and domain rules
deploy/         Docker Compose and Caddy configuration
docs/           Development, deployment, and data documentation
```

## Local Development

Use Node.js 24 (24.18.0 or newer, below 25) and the pnpm version declared in
`package.json`. Java 21 or newer is needed only for Firestore Emulator tests.

Run from the repository root:

```sh
pnpm install
cp .env.example .env
```

Fill in the Firebase credentials and the OAuth settings for the platforms you
will test. See [Local development](docs/local-development.md) for setup details.
Use a separate development Firebase project, not the production project.

```sh
pnpm dev
```

- Web: http://localhost:5173
- API health check: http://localhost:3000/health
- Stop both development processes with Ctrl+C.

`pnpm dev` runs Vite and Fastify separately; Vite proxies `/api` and `/events`
to Fastify. The production container serves the built web app through Fastify.

## Checks

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm test:emulator
pnpm build
```

Emulator tests use the isolated `demo-elobadge-emulator` project and do not
connect to production Firestore.

## Deployment

GitHub Actions builds and publishes the container image. Production deployment
is manual: the Lightsail server pulls and runs the selected image.
Keep one application container while OAuth state and realtime delivery remain
in process memory.

See [Lightsail deployment](docs/lightsail-deployment.md) for setup, updates,
and rollback.

## Documentation

- [Local development and OAuth setup](docs/local-development.md)
- [Repository structure](docs/repository-structure.md)
- [Firestore data model](docs/firestore-data-model.md)
- [Operational tools and diagnostics](docs/operations.md)
- [Privacy data inventory](docs/privacy-data-inventory.md)
- [Privacy request handling](docs/privacy-request-process.md)
