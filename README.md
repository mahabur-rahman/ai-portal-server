<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive app <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

RND Server - A NestJS application with automated CI/CD pipeline for deployment to AWS EC2 via Docker Hub.

**Production URL:** https://15.207.16.104/api/v1

## 🚀 CI/CD Pipeline

This project features a complete automated deployment pipeline:

- **Push to `main` branch** → Automatically builds, tests, and deploys to production
- **GitHub Actions** → Builds Docker image and pushes to Docker Hub
- **AWS EC2** → Automatically pulls latest image and restarts container
- **Zero Downtime** → Seamless deployments with health checks

### Quick Setup

See [CI-CD-SETUP.md](./CI-CD-SETUP.md) for complete setup instructions.

**Required GitHub Secrets:**
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token
- `EC2_HOST` - EC2 instance IP (15.207.16.104)
- `EC2_USERNAME` - SSH username (ubuntu/ec2-user)
- `EC2_SSH_KEY` - Private SSH key content

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t rnd-server .

# Run container
docker run -d -p 5000:5000 --env-file .env.prod --name rnd-server rnd-server
```

### Deploy to Production (Manual)

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@15.207.16.104

# Run deployment script
cd ~/rnd-server
## ☸️ Kubernetes (EKS) Deployment

Deploy to AWS EKS with a complete Kubernetes setup.

### Build and Push Docker Image

```bash
# Build image for your repository
docker build -t annurdev/kub-nest-app:latest .

# Push to Docker Hub
docker push annurdev/kub-nest-app:latest
```

### Deploy to EKS

1. **Configure kubectl for your EKS cluster:**
```bash
aws eks update-kubeconfig --region us-east-1 --name your-cluster-name
```

2. **Deploy all manifests:**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

3. **Get your LoadBalancer URL:**
```bash
kubectl get ingress -n rnd-server
```

**Access your application:**
- API: `http://<LOAD_BALANCER_URL>/api/v1`
- GraphQL Playground: `http://<LOAD_BALANCER_URL>/graphql`

### Kubernetes Files

- `k8s/namespace.yaml` - Application namespace
- `k8s/secret.yaml` - Sensitive data (API keys, DB credentials)
- `k8s/configmap.yaml` - Non-sensitive configuration
- `k8s/deployment.yaml` - Application deployment with 2 replicas
- `k8s/service.yaml` - LoadBalancer service
- `k8s/ingress.yaml` - AWS ALB ingress for routing

## Deployment

This project uses automated CI/CD with GitHub Actions. Every push to `main` triggers:

1. ✅ Build and test
2. 🐳 Docker image build and push to Docker Hub
3. 🚀 Automatic deployment to AWS EC2
4. ✨ Live at https://15.207.16.104/api/v1

For detailed setup instructions, see [CI-CD-SETUP.md](./CI-CD-SETUP.md).

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
