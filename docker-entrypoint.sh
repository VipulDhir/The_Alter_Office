#!/bin/sh

# Start MySQL in background
echo "Starting MySQL..."
mysqld_safe --datadir=/var/lib/mysql &
sleep 10

# Initialize database if not exists
mysql -e "CREATE DATABASE IF NOT EXISTS analytics;"

# Start Redis in background
echo "Starting Redis..."
redis-server --daemonize yes

# Start Node.js app
echo "Starting Node.js app..."
node src/server.js
