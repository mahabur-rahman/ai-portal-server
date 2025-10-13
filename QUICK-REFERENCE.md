# 🚀 Quick Reference Guide

## Common Commands

### Local Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Run linter
npm run lint
```

### Docker Commands
```bash
# Build Docker image
docker build -t rnd-server .

# Run container locally
docker run -d -p 5000:5000 --env-file .env.prod --name rnd-server rnd-server

# View running containers
docker ps

# View all containers
docker ps -a

# Stop container
docker stop rnd-server

# Remove container
docker rm rnd-server

# View logs
docker logs rnd-server

# Follow logs in real-time
docker logs rnd-server -f

# View last 50 lines
docker logs rnd-server --tail 50

# Execute command in container
docker exec -it rnd-server sh

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a
```

### Docker Hub Commands
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag rnd-server:latest yourusername/rnd-server:latest

# Push to Docker Hub
docker push yourusername/rnd-server:latest

# Pull from Docker Hub
docker pull yourusername/rnd-server:latest
```

### EC2 Commands
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Copy file to EC2
scp -i your-key.pem file.txt ubuntu@15.207.16.104:~/

# Copy file from EC2
scp -i your-key.pem ubuntu@15.207.16.104:~/file.txt ./

# Run deployment script
cd ~/rnd-server && ./deploy.sh

# Check Docker status
sudo systemctl status docker

# View container logs
docker logs rnd-server --tail 100

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
top
```

### Git Commands
```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "your message"

# Push to main (triggers CI/CD)
git push origin main

# Create new branch
git checkout -b feature/new-feature

# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# View commit history
git log --oneline -10
```

## GitHub Secrets

Required secrets in GitHub repository settings:

| Secret | Value |
|--------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `EC2_HOST` | 15.207.16.104 |
| `EC2_USERNAME` | ubuntu or ec2-user |
| `EC2_SSH_KEY` | Contents of .pem file |
| `EC2_SSH_PORT` | 22 (optional) |

## Environment Variables

### .env.local (Development)
```env
NODE_ENV=development
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=dev_user
DATABASE_PASSWORD=dev_password
DATABASE_NAME=dev_db
```

### .env.prod (Production - on EC2)
```env
NODE_ENV=production
PORT=5000
DATABASE_HOST=your-production-db-host
DATABASE_PORT=5432
DATABASE_USER=prod_user
DATABASE_PASSWORD=prod_password
DATABASE_NAME=prod_db
```

## Deployment Flow

```
Code Change → Git Push → GitHub Actions → Docker Hub → AWS EC2 → Live
```

1. **Developer** pushes code to `main` branch
2. **GitHub Actions** triggers CI/CD pipeline
3. **Build & Test** job runs tests and builds code
4. **Docker Build** creates and pushes image to Docker Hub
5. **Deploy** job SSHs into EC2 and pulls latest image
6. **Container** restarts with new code
7. **Application** is live at https://15.207.16.104/api/v1

## Troubleshooting Commands

### Check GitHub Actions
```bash
# View workflow status
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

### Debug on EC2
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Check if container is running
docker ps | grep rnd-server

# View full logs
docker logs rnd-server

# Check container health
docker inspect rnd-server | grep -A 10 Health

# Restart container
docker restart rnd-server

# Check environment variables
docker exec rnd-server env

# Test database connection
docker exec -it rnd-server sh
# Then inside container:
# npm run typeorm query "SELECT 1"

# Check network
docker network ls
docker network inspect bridge

# Check disk space
df -h

# Check memory
free -m

# Check CPU
top
```

### Manual Deployment
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Navigate to app directory
cd ~/rnd-server

# Pull latest image
docker pull yourusername/rnd-server:latest

# Stop old container
docker stop rnd-server

# Remove old container
docker rm rnd-server

# Run new container
docker run -d \
  --name rnd-server \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env.prod \
  yourusername/rnd-server:latest

# Check logs
docker logs rnd-server -f
```

## Health Check Endpoints

```bash
# Check if API is running
curl https://15.207.16.104/api/v1

# Check with verbose output
curl -v https://15.207.16.104/api/v1

# Check from EC2 (local)
curl http://localhost:5000/api/v1
```

## Useful URLs

- **Production API:** https://15.207.16.104/api/v1
- **Docker Hub:** https://hub.docker.com/r/yourusername/rnd-server
- **GitHub Actions:** https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- **NestJS Docs:** https://docs.nestjs.com

## File Structure

```
rnd-server/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml              # Main CI/CD pipeline
│       └── README.md              # Workflow documentation
├── scripts/
│   └── setup-ec2.sh               # EC2 setup script
├── src/                           # Source code
├── dist/                          # Built code
├── .dockerignore                  # Docker ignore file
├── .env.local                     # Local environment
├── .env.prod                      # Production environment (on EC2)
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose config
├── deploy.sh                      # Deployment script
├── package.json                   # Dependencies
├── CI-CD-SETUP.md                 # Complete setup guide
├── DEPLOYMENT-CHECKLIST.md        # Deployment checklist
├── QUICK-REFERENCE.md             # This file
└── README.md                      # Project documentation
```

## Support

For detailed instructions, see:
- [CI-CD-SETUP.md](./CI-CD-SETUP.md) - Complete setup guide
- [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - Step-by-step checklist
- [README.md](./README.md) - Project overview

## Emergency Rollback

If deployment fails and you need to rollback:

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Stop current container
docker stop rnd-server
docker rm rnd-server

# Pull previous version (use specific tag)
docker pull yourusername/rnd-server:main-abc123

# Run previous version
docker run -d \
  --name rnd-server \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env.prod \
  yourusername/rnd-server:main-abc123
```

## Performance Monitoring

```bash
# Check container stats
docker stats rnd-server

# Check container resource usage
docker inspect rnd-server | grep -A 20 Memory

# Monitor logs in real-time
docker logs rnd-server -f --tail 100

# Check application response time
time curl https://15.207.16.104/api/v1
```

---

**💡 Tip:** Bookmark this page for quick access to common commands!
