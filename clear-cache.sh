#!/bin/bash

echo "🧹 Clearing React Native cache..."

# Stop any running Metro processes
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true

# Clear various cache directories
rm -rf .expo 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

# Clear npm cache
npm cache clean --force 2>/dev/null || true

echo "✅ Cache cleared successfully!"
echo "🚀 Starting Metro with fresh cache..."

# Start Metro with clear cache
npx expo start --clear --reset-cache
