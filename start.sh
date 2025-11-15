#!/bin/bash
set -e

# Start MySQL in background
mysqld_safe --datadir=/var/lib/mysql &
echo "Waiting for MySQL to start..."
sleep 15

# Initialize database if needed
mysql -e "CREATE DATABASE IF NOT EXISTS analytics;"

# Start Redis in background
redis-server --daemonize yes

# Start Node.js
node src/server.js
