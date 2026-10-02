# Operational Tools

Deployment, image updates, rollback, and health monitoring are documented in
[Lightsail deployment](lightsail-deployment.md).

## Administrator Page

Configure `ADMIN_FIREBASE_UIDS` with a comma-separated allowlist of Firebase
UIDs. Sign in and open `/admin` to inspect database counts, runtime metrics,
and recent overlay usage.

Recent usage shows at most 50 streamers from the last 30 days, based on public
overlay SSE connections, not verified live broadcasts. The last usage timestamp
is persisted at most every five minutes per streamer per process. Dashboard
preview connections are excluded; tracking starts when this feature is deployed.

## Bulk Chzzk Token Revocation

Before changing Chzzk application permissions, inspect the affected tokens.
The command is a dry run by default; execution requires explicit project
confirmation.

From the local repository:

```sh
pnpm chzzk:revoke-all
pnpm chzzk:revoke-all --execute --confirm-project=<FIREBASE_PROJECT_ID>
```

On the production server, from the deployment directory:

```sh
docker compose exec -T app node apps/server/dist/scripts/revoke-chzzk-streamer-tokens.js
docker compose exec -T app node apps/server/dist/scripts/revoke-chzzk-streamer-tokens.js --execute --confirm-project=<FIREBASE_PROJECT_ID>
```

Remote revocation failures require investigation; do not assume every token
was revoked just because the command completed. Consult the command summary
and confirm the target project before execution.

## Temporary Chzzk Diagnostics

Enable diagnostics only while collecting samples, then disable them and restart.

- `CHZZK_BADGE_DIAGNOSTICS=true`: logs sanitized badge shapes once per unique
  shape in a process, omitting chat content and nicknames.
- `CHZZK_PRIVATE_CHAT_DIAGNOSTIC_UIDS`: comma-separated test streamer Firebase
  UIDs. After an official chat event supplies a chat-channel ID, an additional
  read-only private socket observes moderation commands.

The private socket also removes a viewer's displayed messages when it receives
the confirmed `94008` moderation command. Use the UID allowlist for a staged
rollout, or `CHZZK_PRIVATE_CHAT_MODERATION_ENABLED=true` for all Chzzk streamers.
Unknown commands never remove messages. This relies on an undocumented provider
interface and may change independently of EloBadge.

Do not enable raw payload logging to troubleshoot production chat: message
content and personal data must not be added to application logs.
