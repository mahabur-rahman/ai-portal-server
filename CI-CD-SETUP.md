# CI/CD Setup Guide for RND Server

This guide will help you set up automatic deployment from GitHub to Docker Hub to AWS EC2.

## 🎯 Overview

When you push code to the `main` branch:
1. ✅ GitHub Actions builds and tests your code
2. 🐳 Builds Docker image and pushes to Docker Hub
3. 🚀 Automatically deploys to AWS EC2 instance
4. ✨ Your API at `https://15.207.16.104/api/v1` is updated

---

## 📋 Prerequisites

### 1. Docker Hub Account
- Create account at [hub.docker.com](https://hub.docker.com)
- Create a repository named `rnd-server`
- Generate an access token (Settings → Security → New Access Token)

### 2. AWS EC2 Instance
- Running Ubuntu/Amazon Linux
- Docker installed
- SSH access configured
- Port 5000 open in security group
- Nginx/reverse proxy configured for HTTPS

### 3. GitHub Repository
- Your code pushed to GitHub
- Admin access to configure secrets

---

## 🔧 Setup Instructions

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | `yourusername` |
| `DOCKER_PASSWORD` | Docker Hub access token | `dckr_pat_xxxxx` |
| `EC2_HOST` | EC2 instance IP address | `15.207.16.104` |
| `EC2_USERNAME` | SSH username for EC2 | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | Private SSH key for EC2 | Contents of your `.pem` file |
| `EC2_SSH_PORT` | SSH port (optional) | `22` (default) |

#### How to get EC2_SSH_KEY:
```bash
# On Windows (PowerShell)
Get-Content -Path "path\to\your-key.pem" -Raw | clip

# On Mac/Linux
cat path/to/your-key.pem | pbcopy  # Mac
cat path/to/your-key.pem | xclip   # Linux
```

Then paste the entire content into the GitHub secret.

---

### Step 2: Prepare Your EC2 Instance

SSH into your EC2 instance:

```bash
ssh -i your-key.pem ubuntu@15.207.16.104
```

#### Install Docker (if not already installed):

```bash
# Update system
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (no sudo needed)
sudo usermod -aG docker $USER

# Log out and log back in for group changes to take effect
exit
```

#### Create application directory and .env.prod file:

```bash
# Create directory
mkdir -p ~/rnd-server
cd ~/rnd-server

# Create .env.prod file
nano .env.prod
```

Add your production environment variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name
# Add other environment variables as needed
```

Save and exit (Ctrl+X, then Y, then Enter).

#### Set proper permissions:

```bash
chmod 600 .env.prod
```

---

### Step 3: Update Docker Image Name

Update the Docker image name in the workflow to match your Docker Hub username.

In `.github/workflows/ci-cd.yml`, the image name is set as:
```yaml
DOCKER_IMAGE_NAME: ${{ secrets.DOCKER_USERNAME }}/rnd-server
```

This will automatically use your Docker Hub username.

---

### Step 4: Test the Pipeline

1. **Make a change** to your code
2. **Commit and push** to the `main` branch:

```bash
git add .
git commit -m "test: trigger CI/CD pipeline"
git push origin main
```

3. **Monitor the workflow**:
   - Go to GitHub → Actions tab
   - Watch the pipeline execute
   - Check each job's logs

4. **Verify deployment**:
   - Visit: `https://15.207.16.104/api/v1`
   - Check if your changes are live

---

## 🔍 Monitoring and Debugging

### View GitHub Actions Logs
- Go to your repository → Actions tab
- Click on the workflow run
- Click on each job to see detailed logs

### Check Docker Hub
- Go to [hub.docker.com](https://hub.docker.com)
- Navigate to your `rnd-server` repository
- Verify new images are being pushed

### SSH into EC2 and Check Logs

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Check running containers
docker ps

# View container logs
docker logs rnd-server

# View last 50 lines
docker logs rnd-server --tail 50

# Follow logs in real-time
docker logs rnd-server -f

# Check container status
docker inspect rnd-server
```

### Manual Deployment on EC2

If you need to manually deploy:

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Navigate to app directory
cd ~/rnd-server

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

---

## 🚨 Troubleshooting

### Pipeline fails at "Build and Test"
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check linting errors

### Pipeline fails at "Docker Build"
- Verify Docker Hub credentials in GitHub secrets
- Check Dockerfile syntax
- Ensure `.env.prod` is properly configured

### Pipeline fails at "Deploy to EC2"
- Verify EC2 SSH credentials in GitHub secrets
- Check EC2 security group allows SSH (port 22)
- Verify Docker is installed on EC2
- Check `.env.prod` exists on EC2

### Container fails to start
- Check container logs: `docker logs rnd-server`
- Verify environment variables in `.env.prod`
- Check if port 5000 is available
- Ensure database connection is working

### Application not accessible
- Check Nginx configuration
- Verify SSL certificates
- Check EC2 security group allows port 5000
- Verify reverse proxy is working

---

## 📝 Workflow Details

### Jobs Overview

1. **build-and-test**
   - Runs on every push and PR
   - Installs dependencies
   - Runs linter
   - Builds application
   - Runs tests

2. **docker-build-push**
   - Runs only on push to `main`
   - Builds Docker image
   - Pushes to Docker Hub with `latest` tag
   - Uses build cache for faster builds

3. **deploy-to-ec2**
   - Runs only on push to `main`
   - SSHs into EC2
   - Pulls latest image
   - Stops old container
   - Starts new container
   - Verifies deployment

4. **notify**
   - Runs after all jobs
   - Shows deployment status

---

## 🔐 Security Best Practices

1. **Never commit secrets** to your repository
2. **Use GitHub Secrets** for all sensitive data
3. **Rotate SSH keys** regularly
4. **Use Docker Hub access tokens** instead of passwords
5. **Keep .env.prod** secure on EC2 (chmod 600)
6. **Use HTTPS** for your API (configure SSL/TLS)
7. **Keep EC2 security groups** restrictive
8. **Update dependencies** regularly

---

## 🎨 Customization

### Change Docker Image Name
Edit `.github/workflows/ci-cd.yml`:
```yaml
env:
  DOCKER_IMAGE_NAME: your-dockerhub-username/your-image-name
```

### Change Branch for Deployment
Edit `.github/workflows/ci-cd.yml`:
```yaml
on:
  push:
    branches:
      - production  # Change from 'main' to your branch
```

### Add Environment-Specific Deployments
You can create multiple workflows for different environments:
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

### Add Slack/Discord Notifications
Add notification steps to the `notify` job using webhooks.

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Docker container logs on EC2
4. Verify all secrets are correctly configured
5. Ensure EC2 security groups are properly configured

---

## ✅ Checklist

Before going live, ensure:

- [ ] Docker Hub repository created
- [ ] All GitHub secrets configured
- [ ] EC2 instance has Docker installed
- [ ] `.env.prod` file created on EC2
- [ ] EC2 security groups configured
- [ ] Nginx/reverse proxy configured
- [ ] SSL certificates installed
- [ ] Database connection working
- [ ] Test deployment successful
- [ ] Application accessible at `https://15.207.16.104/api/v1`

---

**🎉 Congratulations! Your CI/CD pipeline is now set up!**

Every push to `main` will automatically deploy your application to production.
