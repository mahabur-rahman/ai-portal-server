# 🚀 Deployment Checklist

Use this checklist to ensure your CI/CD pipeline is properly configured.

## 📋 Pre-Deployment Setup

### 1. Docker Hub Configuration
- [ ] Created Docker Hub account at [hub.docker.com](https://hub.docker.com)
- [ ] Created repository named `rnd-server` (or your preferred name)
- [ ] Generated Docker Hub access token (Settings → Security → New Access Token)
- [ ] Saved access token securely

### 2. AWS EC2 Instance Setup
- [ ] EC2 instance is running
- [ ] Docker is installed on EC2
- [ ] SSH access is configured
- [ ] Security group allows:
  - [ ] Port 22 (SSH)
  - [ ] Port 5000 (Application)
  - [ ] Port 80/443 (HTTP/HTTPS if using reverse proxy)
- [ ] Nginx/reverse proxy is configured (if using HTTPS)
- [ ] SSL certificates are installed (if using HTTPS)

### 3. EC2 Application Directory
- [ ] Created directory: `~/rnd-server`
- [ ] Created `.env.prod` file with all environment variables
- [ ] Set proper permissions: `chmod 600 .env.prod`
- [ ] Verified environment variables are correct

### 4. GitHub Repository Setup
- [ ] Code is pushed to GitHub
- [ ] Repository is accessible
- [ ] You have admin access to configure secrets

## 🔐 GitHub Secrets Configuration

Go to: Repository → Settings → Secrets and variables → Actions

- [ ] `DOCKER_USERNAME` - Your Docker Hub username
- [ ] `DOCKER_PASSWORD` - Docker Hub access token (not your password!)
- [ ] `EC2_HOST` - EC2 IP address (e.g., 15.207.16.104)
- [ ] `EC2_USERNAME` - SSH username (ubuntu or ec2-user)
- [ ] `EC2_SSH_KEY` - Complete private SSH key content (.pem file)
- [ ] `EC2_SSH_PORT` - SSH port (optional, default: 22)

### How to Copy SSH Key:
```bash
# Windows PowerShell
Get-Content -Path "path\to\your-key.pem" -Raw | clip

# Mac
cat path/to/your-key.pem | pbcopy

# Linux
cat path/to/your-key.pem | xclip
```

## 📁 Project Files

- [ ] `.github/workflows/ci-cd.yml` - CI/CD workflow file exists
- [ ] `Dockerfile` - Docker configuration exists
- [ ] `.dockerignore` - Docker ignore file exists
- [ ] `deploy.sh` - Deployment script exists
- [ ] `.env.prod` - Production environment file exists (on EC2)

## 🧪 Testing

### Local Testing
- [ ] Application builds successfully: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Linter passes: `npm run lint`
- [ ] Docker image builds: `docker build -t rnd-server .`
- [ ] Docker container runs: `docker run -p 5000:5000 rnd-server`

### EC2 Testing
- [ ] Can SSH into EC2: `ssh -i your-key.pem ubuntu@15.207.16.104`
- [ ] Docker is installed: `docker --version`
- [ ] Can pull from Docker Hub: `docker pull hello-world`
- [ ] `.env.prod` file exists and is readable

## 🚀 First Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: setup CI/CD pipeline"
git push origin main
```

### Step 2: Monitor Workflow
- [ ] Go to GitHub → Actions tab
- [ ] Watch workflow execution
- [ ] All jobs complete successfully:
  - [ ] ✅ build-and-test
  - [ ] ✅ docker-build-push
  - [ ] ✅ deploy-to-ec2
  - [ ] ✅ notify

### Step 3: Verify Deployment
- [ ] Visit: https://15.207.16.104/api/v1
- [ ] Application is accessible
- [ ] API responds correctly
- [ ] No errors in response

### Step 4: Check EC2
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Check container is running
docker ps | grep rnd-server

# Check logs
docker logs rnd-server --tail 50
```

- [ ] Container is running
- [ ] No errors in logs
- [ ] Application started successfully

## 🔍 Post-Deployment Verification

### Application Health
- [ ] API endpoint responds: `https://15.207.16.104/api/v1`
- [ ] Database connection works
- [ ] All features function correctly
- [ ] No errors in logs

### Docker Hub
- [ ] New image appears in Docker Hub repository
- [ ] Image has `latest` tag
- [ ] Image size is reasonable

### GitHub Actions
- [ ] Workflow completed successfully
- [ ] All jobs show green checkmarks
- [ ] No errors in logs

## 🔄 Subsequent Deployments

For every code change:

1. **Make changes** to your code
2. **Commit and push** to `main` branch
3. **Monitor** GitHub Actions
4. **Verify** deployment at https://15.207.16.104/api/v1

## 🚨 Troubleshooting Checklist

If deployment fails, check:

### Build Fails
- [ ] All dependencies in `package.json`
- [ ] TypeScript compiles without errors
- [ ] Linter passes
- [ ] Tests pass

### Docker Build Fails
- [ ] Docker Hub credentials are correct
- [ ] Dockerfile syntax is valid
- [ ] All required files are present

### Deployment Fails
- [ ] EC2 is accessible via SSH
- [ ] SSH key is correct (includes BEGIN/END lines)
- [ ] Docker is installed on EC2
- [ ] `.env.prod` exists on EC2
- [ ] Port 5000 is available

### Container Fails to Start
- [ ] Environment variables are correct
- [ ] Database is accessible
- [ ] No port conflicts
- [ ] Sufficient memory/resources

### Application Not Accessible
- [ ] Security group allows port 5000
- [ ] Nginx configuration is correct
- [ ] SSL certificates are valid
- [ ] DNS/IP is correct

## 📝 Maintenance Checklist

### Weekly
- [ ] Check application logs
- [ ] Monitor resource usage
- [ ] Verify backups

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review security advisories: `npm audit`
- [ ] Rotate SSH keys
- [ ] Update Docker Hub access tokens

### Quarterly
- [ ] Review and update documentation
- [ ] Test disaster recovery
- [ ] Optimize Docker image size
- [ ] Review CI/CD pipeline efficiency

## ✅ Success Criteria

Your CI/CD pipeline is successfully set up when:

- [x] Code push to `main` triggers automatic deployment
- [x] Docker image is built and pushed to Docker Hub
- [x] EC2 automatically pulls and runs new image
- [x] Application is accessible at https://15.207.16.104/api/v1
- [x] No manual intervention required
- [x] Deployment completes in < 5 minutes
- [x] Zero downtime during deployment

## 🎉 Congratulations!

Once all items are checked, your CI/CD pipeline is fully operational!

Every push to `main` will now automatically deploy to production.

---

**Need Help?** See [CI-CD-SETUP.md](./CI-CD-SETUP.md) for detailed instructions.
