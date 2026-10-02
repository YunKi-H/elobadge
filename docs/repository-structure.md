# Repository Structure

EloBadge is a pnpm monorepo with one production application container.

```text
apps/
  server/src/
    auth/         Firebase authentication and platform OAuth flows
    routes/       HTTP and SSE endpoints
    chzzk/        Chzzk chat sessions and moderation monitor
    twitch/       Twitch EventSub chat collection
    chat/         Shared chat normalization
    chess/        Chess.com and Lichess linking and rating refresh
    firebase/     Firestore reads, writes, transactions, and emulator tests
    realtime/     Event fan-out, overlay connections, and usage tracking
    security/     Token encryption, HTTP security, and CSS validation
    monitoring/   Operational health reporting
    scripts/      Operator commands
    config/       Environment loading
  web/src/
    api/          Authenticated API client
    firebase/     Browser authentication
    ui/           Dashboard and overlay components
packages/core/    Shared domain types and pure rules
deploy/           Docker Compose and Caddy
docs/             Development and operational documentation
```

## Runtime

Caddy terminates HTTPS and proxies requests to Fastify. Fastify serves the built
React app, API endpoints, and SSE streams, and runs chat collectors and background
jobs in the same Node.js process.

The browser authenticates with Firebase and sends its ID token to Fastify.
Firestore application data is accessed only through the server's Admin SDK;
direct browser access is denied by Firestore rules.

Chzzk and Twitch collectors publish shared chat events to streamer-scoped
overlays. Dashboard routes and the transparent browser-source route have
separate layouts and are loaded on demand.

## Scaling Boundary

Run one application container for now. OAuth state, login-code exchange,
realtime subscriptions, and some token-refresh coordination are held in memory.
Multiple instances require shared state and coordination before load balancing
can be introduced safely.
