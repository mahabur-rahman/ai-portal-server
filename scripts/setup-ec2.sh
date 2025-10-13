#!/bin/bash

# EC2 Setup Script for RND Server
# Run this script on your EC2 instance to prepare it for deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   RND Server - EC2 Setup Script       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run this script as root${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt-get update -y

# Install Docker if not installed
if ! command_exists docker; then
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"
    
    # Install prerequisites
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up stable repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
    echo -e "${YELLOW}⚠️  Please log out and log back in for group changes to take effect${NC}"
else
    echo -e "${GREEN}✅ Docker is already installed${NC}"
    docker --version
fi

# Create application directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
mkdir -p ~/rnd-server
cd ~/rnd-server

# Create .env.prod template if it doesn't exist
if [ ! -f ".env.prod" ]; then
    echo -e "${YELLOW}📝 Creating .env.prod template...${NC}"
    cat > .env.prod << 'EOF'
# Production Environment Variables
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name

# Add other environment variables below
# OPENAI_API_KEY=your-api-key
# JWT_SECRET=your-jwt-secret
EOF
    chmod 600 .env.prod
    echo -e "${GREEN}✅ .env.prod template created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env.prod and add your actual values${NC}"
else
    echo -e "${GREEN}✅ .env.prod already exists${NC}"
fi

# Download deployment script
if [ ! -f "deploy.sh" ]; then
    echo -e "${YELLOW}📥 Creating deployment script...${NC}"
    cat > deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash

# Deployment script for RND Server
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOCKER_IMAGE="rnd-server"
CONTAINER_NAME="rnd-server"
PORT=5000

echo -e "${YELLOW}🚀 Starting deployment...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if [ ! -f ".env.prod" ]; then
    echo -e "${RED}❌ .env.prod file not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Pulling latest Docker image...${NC}"
docker pull ${DOCKER_IMAGE}:latest

echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true

echo -e "${YELLOW}🗑️  Removing existing container...${NC}"
docker rm ${CONTAINER_NAME} 2>/dev/null || true

echo -e "${YELLOW}🏃 Starting new container...${NC}"
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${PORT}:${PORT} \
  --env-file .env.prod \
  ${DOCKER_IMAGE}:latest

sleep 5

if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo -e "${GREEN}✅ Container is running successfully!${NC}"
    docker ps -a | grep ${CONTAINER_NAME}
    echo -e "\n${YELLOW}📝 Recent Logs:${NC}"
    docker logs ${CONTAINER_NAME} --tail 30
    echo -e "\n${GREEN}🎉 Deployment completed!${NC}"
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    docker logs ${CONTAINER_NAME} --tail 50
    exit 1
fi

echo -e "\n${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -af

echo -e "\n${GREEN}✨ All done!${NC}"
DEPLOY_SCRIPT
    chmod +x deploy.sh
    echo -e "${GREEN}✅ Deployment script created${NC}"
else
    echo -e "${GREEN}✅ deploy.sh already exists${NC}"
fi

# Install Docker Compose (optional but useful)
if ! command_exists docker-compose; then
    echo -e "${YELLOW}🔧 Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose is already installed${NC}"
fi

# Check firewall status
echo -e "${YELLOW}🔥 Checking firewall...${NC}"
if command_exists ufw; then
    sudo ufw status
    echo -e "${YELLOW}⚠️  Make sure port 5000 is allowed in your firewall${NC}"
    echo -e "${YELLOW}   Run: sudo ufw allow 5000${NC}"
fi

# Display summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Setup Complete! 🎉            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Docker installed and configured${NC}"
echo -e "${GREEN}✅ Application directory created: ~/rnd-server${NC}"
echo -e "${GREEN}✅ .env.prod template created${NC}"
echo -e "${GREEN}✅ Deployment script created${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Edit .env.prod with your actual values:"
echo -e "      ${BLUE}nano ~/rnd-server/.env.prod${NC}"
echo ""
echo -e "   2. Configure GitHub Secrets with:"
echo -e "      - DOCKER_USERNAME"
echo -e "      - DOCKER_PASSWORD"
echo -e "      - EC2_HOST"
echo -e "      - EC2_USERNAME"
echo -e "      - EC2_SSH_KEY"
echo ""
echo -e "   3. Push your code to GitHub main branch"
echo ""
echo -e "   4. Watch the magic happen! ✨"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo -e "   - Log out and log back in for Docker group changes"
echo -e "   - Ensure AWS Security Group allows ports 22 and 5000"
echo -e "   - Update .env.prod with real database credentials"
echo ""
echo -e "${GREEN}🚀 Your EC2 instance is ready for deployment!${NC}"
