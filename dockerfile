# Use Node.js base image
FROM node:18-alpine

# Install dependencies for MySQL and Redis
RUN apk add --no-cache mysql mysql-client redis

# Create app directory
WORKDIR /app

# Copy app files
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Expose ports
EXPOSE 8080 3306 6379

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Start all services
ENTRYPOINT ["docker-entrypoint.sh"]
