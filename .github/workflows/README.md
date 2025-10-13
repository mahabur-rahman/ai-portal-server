# GitHub Actions Workflows

## Available Workflows

### CI/CD Pipeline (`ci-cd.yml`)

Automated deployment pipeline that runs on every push to `main` branch.

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**
1. **build-and-test** - Builds and tests the application
2. **docker-build-push** - Builds Docker image and pushes to Docker Hub
3. **deploy-to-ec2** - Deploys to AWS EC2 instance
4. **notify** - Notifies deployment status

## Workflow Status

You can view the status of workflows at:
- GitHub Repository → Actions tab
- Or visit: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

## Manual Workflow Trigger

You can manually trigger a workflow from the GitHub Actions tab:
1. Go to Actions tab
2. Select the workflow
3. Click "Run workflow"
4. Select branch and run

## Secrets Required

The following secrets must be configured in GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `EC2_HOST` | EC2 instance IP address |
| `EC2_USERNAME` | SSH username for EC2 |
| `EC2_SSH_KEY` | Private SSH key content |
| `EC2_SSH_PORT` | SSH port (optional, default: 22) |

## Monitoring

### View Workflow Logs
1. Go to Actions tab
2. Click on the workflow run
3. Click on each job to see logs

### Check Deployment Status
- Successful deployment shows: ✅ Deployment successful!
- Failed deployment shows: ❌ Deployment failed!

### Verify Application
After deployment, verify at: https://15.207.16.104/api/v1

## Troubleshooting

### Workflow Fails
1. Check the job logs in GitHub Actions
2. Verify all secrets are correctly configured
3. Check EC2 instance is accessible
4. Verify Docker Hub credentials

### Container Fails to Start
1. SSH into EC2: `ssh -i your-key.pem ubuntu@15.207.16.104`
2. Check logs: `docker logs rnd-server`
3. Verify environment variables in `.env.prod`

## Customization

To modify the workflow:
1. Edit `.github/workflows/ci-cd.yml`
2. Commit and push changes
3. Workflow will use the new configuration on next run

## Best Practices

- ✅ Always test changes in a feature branch first
- ✅ Use pull requests to review changes before merging to `main`
- ✅ Monitor workflow runs after deployment
- ✅ Keep secrets up to date
- ✅ Regularly update dependencies
