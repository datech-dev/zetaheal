#!/usr/bin/env bash
# ==============================================================================
# Zeta Heal (OT Pathway) - VPS Zero-Downtime Deployment Script
# Supports coexistence with other apps on the VPS via PM2 and Port 3010
# ==============================================================================
set -e

APP_DIR="${APP_DIR:-/var/www/zetaheal}"
BRANCH="${BRANCH:-main}"
PORT="${PORT:-3010}"

echo "========================================================"
echo "🚀 Starting Zeta Heal Deployment"
echo "Directory: $APP_DIR"
echo "Branch: $BRANCH"
echo "Target Port: $PORT"
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "========================================================"

cd "$APP_DIR"

# 1. Fetch latest changes from Git
echo "🔄 Pulling latest changes from branch $BRANCH..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# 2. Check environment file
if [ ! -f "$APP_DIR/.env" ]; then
    echo "⚠️ Creating default .env from .env.example..."
    cp .env.example .env
fi

# 3. Install dependencies & build packages
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building shared packages..."
npm run build:packages

echo "⚡ Building Next.js production bundle..."
npm run build:web

# 4. Reload PM2 process without downtime
echo "🚀 Reloading PM2 process 'zetaheal' on port $PORT..."
if pm2 describe zetaheal > /dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --update-env
else
    pm2 start ecosystem.config.cjs
fi
pm2 save

# 5. Health Check
echo "🩺 Performing health check on http://127.0.0.1:$PORT..."
sleep 3
ATTEMPTS=0
MAX_ATTEMPTS=10

until curl -s -f "http://127.0.0.1:$PORT" > /dev/null 2>&1; do
    ATTEMPTS=$((ATTEMPTS+1))
    if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
        echo "❌ Health check failed after 10 attempts!"
        pm2 logs zetaheal --lines 20 --nostream
        exit 1
    fi
    echo "Waiting for Zeta Heal to respond... (attempt $ATTEMPTS/$MAX_ATTEMPTS)"
    sleep 2
done

echo "========================================================"
echo "✅ Zeta Heal is running on port $PORT without affecting other apps!"
echo "========================================================"
