# Agno Studio Deployment Guide

This guide provides step-by-step instructions for deploying Agno Studio in various environments.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- Kubernetes cluster (for K8s deployment)

## Local Development Deployment

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd agno-studio

# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Edit environment variables
nano .env.local
```

### 2. Configuration

Update `.env.local` with your settings:

```env
# Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Docker Deployment

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f agno-studio

# Stop services
docker-compose down
```

### 2. Production with Nginx

```bash
# Start with Nginx reverse proxy
docker-compose --profile production up -d
```

### 3. Manual Docker Build

```bash
# Build the image
docker build -t agno-studio .

# Run the container
docker run -d \
  --name agno-studio \
  -p 3000:3000 \
  -e JWT_SECRET=your-secret-key \
  -e NEXT_PUBLIC_API_BASE_URL=http://your-api-server:8000 \
  -v $(pwd)/uploads:/app/uploads \
  agno-studio
```

## Kubernetes Deployment

### 1. Prepare the Cluster

```bash
# Ensure kubectl is configured
kubectl cluster-info

# Create namespace (optional)
kubectl create namespace agno-studio
```

### 2. Deploy the Application

```bash
# Apply the Kubernetes configuration
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get pods -l app=agno-studio
kubectl get services -l app=agno-studio
```

### 3. Access the Application

```bash
# Port forward to access locally
kubectl port-forward service/agno-studio-service 3000:80

# Or configure ingress for external access
kubectl get ingress agno-studio-ingress
```

## Production Deployment Checklist

### Security

- [ ] Change default JWT secret
- [ ] Update default admin credentials
- [ ] Configure HTTPS/TLS certificates
- [ ] Set up proper firewall rules
- [ ] Enable rate limiting
- [ ] Configure CORS policies

### Performance

- [ ] Enable Next.js standalone output
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Configure caching strategies
- [ ] Enable compression

### Monitoring

- [ ] Set up health checks
- [ ] Configure logging
- [ ] Set up metrics collection
- [ ] Configure alerting
- [ ] Set up backup strategies

### Environment Variables

```env
# Required
JWT_SECRET=your-production-secret-key
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com

# Optional
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run build
   ```

2. **Docker Build Issues**
   ```bash
   # Clear Docker cache
   docker system prune -a
   docker build --no-cache -t agno-studio .
   ```

3. **Kubernetes Deployment Issues**
   ```bash
   # Check pod logs
   kubectl logs -l app=agno-studio
   
   # Check pod status
   kubectl describe pod -l app=agno-studio
   ```

4. **Authentication Issues**
   - Verify JWT_SECRET is set correctly
   - Check token expiration settings
   - Ensure API endpoints are accessible

### Health Check

The application provides a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-06-19T20:25:10.300Z",
  "uptime": 2.650966042,
  "environment": "production",
  "version": "1.0.0"
}
```

## Scaling

### Horizontal Scaling

```bash
# Scale Docker Compose
docker-compose up -d --scale agno-studio=3

# Scale Kubernetes
kubectl scale deployment agno-studio --replicas=5
```

### Load Balancing

- Use Nginx or HAProxy for load balancing
- Configure sticky sessions if needed
- Set up health checks for backend services

## Backup and Recovery

### Data Backup

```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Backup configuration
cp .env.local config-backup-$(date +%Y%m%d).env
```

### Recovery

```bash
# Restore uploads
tar -xzf uploads-backup-YYYYMMDD.tar.gz

# Restore configuration
cp config-backup-YYYYMMDD.env .env.local
```

## Support

For deployment issues:

1. Check the logs: `docker-compose logs` or `kubectl logs`
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check network connectivity
5. Review the troubleshooting section above

For additional support, create an issue on the project repository. 