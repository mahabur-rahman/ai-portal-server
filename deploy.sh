#!/bin/bash

# Deployment script for RND Server on AWS EC2
# This script pulls the latest Docker image and restarts the container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_IMAGE="rnd-server"
CONTAINER_NAME="rnd-server"
PORT=5000

echo -e "${YELLOW}🚀 Starting deployment...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo -e "${RED}❌ .env.prod file not found!${NC}"
    echo "Please create .env.prod file with your environment variables"
    exit 1
fi

# Pull the latest image from Docker Hub
echo -e "${YELLOW}📦 Pulling latest Docker image...${NC}"
docker pull ${DOCKER_IMAGE}:latest

# Stop existing container
echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true

# Remove existing container
echo -e "${YELLOW}🗑️  Removing existing container...${NC}"
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# Run new container
echo -e "${YELLOW}🏃 Starting new container...${NC}"
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${PORT}:${PORT} \
  --env-file .env.prod \
  ${DOCKER_IMAGE}:latest

# Wait for container to start
echo -e "${YELLOW}⏳ Waiting for container to start...${NC}"
sleep 5

# Check if container is running
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo -e "${GREEN}✅ Container is running successfully!${NC}"
    
    # Show container status
    echo -e "\n${YELLOW}📊 Container Status:${NC}"
    docker ps -a | grep ${CONTAINER_NAME}
    
    # Show logs
    echo -e "\n${YELLOW}📝 Recent Logs:${NC}"
    docker logs ${CONTAINER_NAME} --tail 30
    
    echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}🌐 Application is running at: http://localhost:${PORT}/api/v1${NC}"
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    echo -e "\n${YELLOW}📝 Container Logs:${NC}"
    docker logs ${CONTAINER_NAME} --tail 50
    exit 1
fi

# Clean up old images
echo -e "\n${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -af

echo -e "\n${GREEN}✨ All done!${NC}"
