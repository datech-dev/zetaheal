#!/usr/bin/env bash
# ==============================================================================
# Zeta Heal (OT Pathway) - Automated VPS Deployment Script
# ==============================================================================
set -e

APP_DIR="${APP_DIR:-/var/www/zetaheal}"
BRANCH="${BRANCH:-main}"

echo "========================================================"
echo "🚀 Starting Zeta Heal VPS Deployment"
echo "Target directory: $APP_DIR"
echo "Branch: $BRANCH"
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "========================================================"

# 1. Navigate to application directory or clone if first run
if [ ! -d "$APP_DIR/.git" ]; then
    echo "📦 Application not found at $APP_DIR. Initializing clone..."
    mkdir -p "$APP_DIR"
    git clone https://github.com/datech-dev/zetaheal.git "$APP_DIR"
    cd "$APP_DIR"
else
    cd "$APP_DIR"
    echo "🔄 Fetching latest changes from git..."
    git fetch origin "$BRANCH"
    git reset --hard "origin/$BRANCH"
fi

# 2. Check if .env file exists
if [ ! -f "$APP_DIR/.env" ]; then
    echo "⚠️ Warning: .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "Please update .env with your production credentials."
fi

# 3. Build & Recreate Docker Containers
echo "🐳 Building & restarting production Docker containers..."
docker compose pull || true
docker compose up -d --build --remove-orphans

# 4. Prune unused images to preserve VPS disk space
echo "🧹 Cleaning up dangling Docker images..."
docker image prune -f

# 5. Healthcheck Verification
echo "🩺 Running deployment health check..."
ATTEMPTS=0
MAX_ATTEMPTS=12
SLEEP_SECS=5

until curl -s -f http://127.0.0.1:3000 > /dev/null; do
    ATTEMPTS=$((ATTEMPTS+1))
    if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
        echo "❌ Health check failed after $((MAX_ATTEMPTS * SLEEP_SECS)) seconds!"
        docker compose logs web --tail 50
        exit 1
    fi
    echo "Waiting for web application to become ready... (attempt $ATTEMPTS/$MAX_ATTEMPTS)"
    sleep $SLEEP_SECS
done

echo "========================================================"
echo "✅ Deployment successful! Zeta Heal is running on VPS."
echo "========================================================"
