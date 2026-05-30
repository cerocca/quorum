# SETUP — Quorum Decision Panel

## Requirements

- Docker and docker compose installed
- OpenRouter account with an active API key
- LAN access to Sibilla

## Installation

1. Clone the repo on Sibilla:
   git clone <repo-url> ~/quorum

2. Create the .env file:
   cp ~/quorum/.env.example ~/quorum/.env

3. Open .env and add your OpenRouter key:
   OR_KEY=sk-or-...

4. Start the container:
   cd ~/quorum
   docker compose up -d --build

5. Check the logs:
   docker compose logs -f

## Access

http://sibilla:3003  (or http://<sibilla-ip>:3003)

## First run

On first boot, an admin user is created automatically if the users table is empty.
Credentials are read from .env:

```
ADMIN_USER=admin
ADMIN_PASS=your-password
SESSION_SECRET=change-me-in-production
```

Change these before deploying. After first login, credentials can be updated via Settings > Admin.
Update SESSION_SECRET in .env before any non-local deployment.

## Useful commands

docker compose down          # stop
docker compose up -d --build # rebuild and start
ss -tlnp | grep 3003         # verify port
