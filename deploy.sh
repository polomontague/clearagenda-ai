#!/bin/bash

APP_DIR=/var/www/clearagenda-ai
APP_NAME=clearagenda-ai

# Stop on any error
set -e

# Go to project directory
cd $APP_DIR

# Pull latest changes from GitHub
echo "Pulling latest code..."
git pull origin main

# Install/update dependencies
echo "Installing dependencies..."
npm install

# Apply prisma migrations
echo "Applying Prisma migrations to database"
npx prisma migrate deploy
echo "Generating Prisma client"
npx prisma generate client

# Build the app (if using React or similar)
echo "Building app..."
npm run build

# Restart with PM2
echo "Restarting app..."
pm2 restart $APP_NAME || pm2 start npm --name $APP_NAME -- start

echo "Deployment complete!"