#!/bin/bash

# Start MySQL
mysqld --initialize-insecure --user=root
mysqld_safe &

# Wait a few seconds for MySQL to be ready
sleep 5

# Create database if not exists
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS analytics;"

# Start Redis in background
redis-server --daemonize yes

# Start Node.js app
node src/server.js
