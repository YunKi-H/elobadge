# Lightsail Deployment

This deployment runs one EloBadge application container behind Caddy on a
Lightsail Linux instance. Keep exactly one application container until the
in-memory OAuth exchange and realtime event state move to shared infrastructure.

## 1. Prepare the Domain and GitHub Repository

Choose the production hostname, for example `badge.example.com`.

In the GitHub repository, add these Actions secrets under **Settings > Secrets
and variables > Actions**:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
```

These values become part of the public browser bundle; the `secret` setting only
prevents accidental exposure in build logs. Never add Firebase Admin credentials
or Chzzk secrets as Docker build arguments.

Push to `main` or manually run the **Build container** workflow. It publishes:

```text
ghcr.io/yunki-h/elobadge:latest
ghcr.io/yunki-h/elobadge:sha-<commit>
```

Make the GHCR package public. If it must remain private, authenticate Docker on
the server with a GitHub token that has only `read:packages` permission.

## 2. Create the Lightsail Instance

1. Create an Ubuntu 24.04 LTS Linux instance with at least 1 GB memory.
2. Attach a Lightsail static IPv4 address.
3. Allow TCP ports 80 and 443 and UDP port 443 in the Lightsail firewall.
4. Restrict TCP port 22 to the administrator's IP where practical.
5. Point the hostname's DNS `A` record to the static IPv4 address.

Do not expose Fastify port 3000 in the Lightsail firewall. It is reachable only
from Caddy inside the Compose network.

## 3. Install Docker

Connect over SSH and install Docker from Ubuntu packages:

```sh
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Log out and reconnect once so the Docker group membership takes effect.

## 4. Configure the Service

Clone the repository and create the runtime environment file:

```sh
sudo mkdir -p /opt/elobadge
sudo chown "$USER":"$USER" /opt/elobadge
git clone https://github.com/YunKi-H/elobadge.git /opt/elobadge/repository
cd /opt/elobadge/repository/deploy
cp .env.example .env
chmod 600 .env
```

Edit `deploy/.env`. At minimum, replace every empty value and example domain.
Keep `FIREBASE_PRIVATE_KEY` on one line with literal `\n` sequences. Generate the
token encryption key with:

```sh
openssl rand -base64 32
```

Use the generated value for `CHZZK_TOKEN_ENCRYPTION_KEY`. Do not rotate this key
after streamer tokens have been stored unless every streamer will log in again.

Set `ADMIN_FIREBASE_UIDS` to a comma-separated allowlist of operator Firebase
UIDs. A Chzzk user's UID has the form `chzzk:<channel-id>` and can be copied from
Firebase Authentication. Only these users can open `/admin`; the route is not
linked from the public navigation.

Set `LICHESS_CLIENT_ID=elobadge.com` and
`LICHESS_REDIRECT_URI=https://elobadge.com/api/auth/lichess/callback` for the
Lichess OAuth PKCE flow. Lichess public clients do not use a client secret.

Install the repository's journal retention policy before starting the
containers. This dedicated Lightsail host keeps system and container journal
entries for at most 14 days, rotates journal files daily, and caps persistent
journal storage at 200 MB:

```sh
sudo install -D -m 0644 journald-elobadge.conf \
  /etc/systemd/journald.conf.d/60-elobadge-retention.conf
sudo systemctl restart systemd-journald
sudo journalctl --rotate
sudo journalctl --vacuum-time=14d --vacuum-size=200M
```

The policy applies to the whole host journal, not only EloBadge. The Compose
file sends app and Caddy stdout/stderr to journald with separate
`elobadge-app` and `elobadge-caddy` identifiers. Journal forwarding to syslog is
disabled so the same container messages are not retained separately under a
different rotation policy.

Start the containers:

```sh
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=100 app caddy
```

Confirm newly created containers use the expected driver and that logs are
queryable through both Docker and journald:

```sh
docker inspect --format '{{.HostConfig.LogConfig.Type}}' \
  "$(docker compose ps -q app)"
sudo journalctl -t elobadge-app --since "10 minutes ago" --no-pager
```

The inspect command must print `journald`.

Caddy requests and renews the TLS certificate automatically after DNS resolves
to the instance and ports 80 and 443 are reachable.

## 5. Update OAuth and Firebase

Set the Chzzk developer console callback URL to:

```text
https://badge.example.com/api/auth/chzzk/callback
```

The same value must be stored in `CHZZK_REDIRECT_URI`. Add the production
hostname to **Firebase Authentication > Settings > Authorized domains**.

Deploy the deny-by-default Firestore rules from an authenticated development
machine or Cloud Shell:

```sh
pnpm exec firebase deploy --only firestore:rules --project elobadge
```

The Spark plan does not support managed Firestore TTL deletion. The application
container deletes up to 100 expired Chess.com verification challenges after
startup and every six hours instead. Confirm the startup log contains
`Chess.com verification cleanup scheduled` after each deployment.

The application also removes orphaned inactive overlay documents after startup
and every 24 hours. Confirm the startup log contains
`Inactive overlay cleanup scheduled`. The streamer's current disabled overlay
is preserved for re-enabling with the same OBS URL.

Verify these flows after deployment:

1. Open `/health` and confirm an HTTP 200 response.
2. Complete viewer login and Chess.com account loading.
3. Complete streamer login and confirm the chat session is subscribed.
4. Add the permanent overlay URL to OBS and send a real Chzzk chat message.
5. Restart with `docker compose restart app` and confirm enabled chat sessions
   recover automatically.

## 6. Deploy an Update

After the GitHub workflow succeeds:

```sh
cd /opt/elobadge/repository
git pull --ff-only
cd deploy
docker compose pull
docker compose up -d
docker image prune -f
```

When this logging-policy change is first deployed to an existing host, install
`journald-elobadge.conf` as shown in section 4 and recreate both containers so
the new logging driver takes effect:

```sh
docker compose up -d --force-recreate
```

Check `docker compose ps` and application logs after every update.

## 7. Roll Back

Every build also has an immutable `sha-<commit>` tag. Change
`ELOBADGE_IMAGE` in `deploy/.env` to the previous tag and run:

```sh
docker compose pull app
docker compose up -d app
```

Change the value back to `latest` only after the failing release is fixed.

## 8. Configure Lightsail Monitoring

Lightsail alarms are regional. In the Lightsail console, open **Account >
Profile & contacts**, add an email notification contact in the same AWS Region
as the instance, and confirm the subscription email before creating alarms.
Lightsail currently supports one email notification contact per Region.

Open the production instance, select **Metrics**, and create these alarms:

| Metric | Condition | Evaluation | Purpose |
| --- | --- | --- | --- |
| Status check failures | `>= 1` | 1 of 1 data points | Detect an instance or AWS host failure |
| CPU utilization | `>= 70%` | 3 of 3 data points | Detect sustained CPU saturation |
| Remaining CPU burst capacity percentage | `<= 20%` | 3 of 3 data points | Detect approaching CPU throttling |

Enable email notifications for both `ALARM` and `OK` state changes. Treat
missing CPU and burst data as missing rather than breaching. A status-check
alarm is the highest-priority alert because it can indicate that the instance
itself is unreachable.

Do not add fixed network traffic alarms yet. Observe at least one normal
broadcast week first, then use that traffic as the baseline. Normal SSE traffic
grows with the number of open overlays, so a threshold chosen before observing
production usage is likely to produce false alarms.

When a CPU or burst alarm fires, inspect the host before restarting it:

```sh
cd /opt/elobadge/repository/deploy
docker stats --no-stream
docker compose ps
docker compose logs --since=30m app caddy
sudo journalctl -t elobadge-app \
  --since "30 minutes ago" --no-pager
```

The application writes an `Operational health summary` 30 seconds after startup
and every five minutes. It contains aggregate Chzzk session health and Node.js
memory usage without streamer identifiers or chat content:

```sh
sudo journalctl -t elobadge-app \
  --grep "Operational health summary" \
  --since "30 minutes ago" --no-pager
```

An `info` summary means all managed Chzzk sessions are healthy. A `warn` summary
means at least one session is connecting, reconnecting, failed, or unknown.
Chat inactivity alone is classified as healthy idle and does not generate a
warning.

If CPU remains high, compare the value against the instance plan's sustainable
CPU baseline. If burst capacity continues falling during normal traffic, reduce
background work or move to a larger Lightsail plan using an instance snapshot.
Restarting the application may clear a one-off process fault but does not solve
an under-sized instance.

## 9. Minimum Operations Checklist

- Verify the three Lightsail instance alarms and email notifications.
- Configure AWS and Firebase budget alerts; alerts do not automatically cap cost.
- Review `Operational health summary` logs after every deployment.
- Confirm the verification cleanup service is scheduled in the application log.
- Confirm the inactive overlay cleanup service is scheduled in the application log.
- Confirm containers use journald and the 14-day host retention policy is installed.
- Keep Ubuntu security updates current and reboot during a planned window.
- Never commit `deploy/.env`, service-account JSON, or private keys.
- Retain at most the required Docker images and inspect disk usage periodically.
- Test a full instance reboot before inviting external beta users.
