# Base image
FROM node:18-alpine

# Install bash, mysql, redis
RUN apk add --no-cache bash mysql mysql-client redis

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose ports
EXPOSE 8080 3306 6379

# Add startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Run startup script
CMD ["/start.sh"]
