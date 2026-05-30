# SETUP — Quorum

## Requirements

- Docker and Docker Compose
- OpenRouter account with an active API key

## Installation

1. Clone the repository:
   git clone https://github.com/your-org/quorum ~/quorum
   cd ~/quorum

2. Create the environment file:
   cp .env.example .env

3. Edit .env and set the required values:
   OR_KEY=sk-or-...
   SESSION_SECRET=<random string, 32+ characters>
   ADMIN_USER=admin
   ADMIN_PASS=<strong password>

4. Build and start:
   docker compose up -d --build

5. Check logs:
   docker compose logs -f

## Access

http://localhost:3003
http://<server-ip>:3003  (LAN access)

On first visit you will be redirected to /login.
Use the credentials set in ADMIN_USER / ADMIN_PASS to sign in.

## First run

An admin user is created automatically on first boot if the users table is empty.
Credentials are read from .env at startup — one-shot, never repeated.

After first login, username and password can be updated via Settings > Admin.
Set a strong SESSION_SECRET before exposing the app outside localhost.

## Environment variables

OR_KEY=sk-or-...                    # OpenRouter API key (required)
SESSION_SECRET=change-me            # Session signing secret (required)
ADMIN_USER=admin                    # Initial admin username
ADMIN_PASS=changeme                 # Initial admin password
DEFAULT_MODEL=                      # Optional model fallback if none selected in UI
PORT=3003                           # Default port

## Useful commands

docker compose up -d --build   # build and start
docker compose down            # stop
docker compose logs -f         # follow logs
ss -tlnp | grep 3003           # verify port
