#!/bin/bash

# Railway deployment script for Fleetopia
echo "🚀 Starting Railway deployment..."

# Set environment variables
export NODE_ENV=production
export NIXPACKS_NO_CACHE=true
export NPM_CONFIG_PRODUCTION=false

# Clean up any existing builds
echo "🧹 Cleaning up previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --include=dev

# Build the application
echo "🔨 Building application..."
npm run build

# Start the application
echo "✅ Starting application..."
npm start 