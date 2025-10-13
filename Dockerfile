# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Use ARG for build-time NODE_ENV
ARG NODE_ENV=production

# Install dependencies based on NODE_ENV
# For development, we need dev dependencies for nest CLI
# For production, only production dependencies
RUN if [ "$NODE_ENV" = "development" ]; then npm ci; else npm ci --only=production; fi && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy TypeScript configuration files for development mode
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/src ./src

# Copy environment files from builder stage (both dev and prod)
COPY --from=builder /app/.env.local .env.local
COPY --from=builder /app/.env.prod .env.prod

# Expose port
EXPOSE 5000

# Use environment variable for NODE_ENV (can be overridden at runtime)
ENV NODE_ENV=production

# Start the application based on NODE_ENV
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run start:dev; else npm run start:prod; fi"]
