# 🚀 Fleetopia.co Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Copy `env.example` to `.env` and configure all variables
- [ ] Set up PostgreSQL database (local or cloud)
- [ ] Configure NextAuth.js secrets
- [ ] Set up API keys for external services
- [ ] Configure email service (optional)
- [ ] Set up monitoring and analytics (optional)

### ✅ Security Checklist
- [ ] Update all default passwords and secrets
- [ ] Enable HTTPS in production
- [ ] Configure CORS policies
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure CSP (Content Security Policy)

### ✅ Database Setup
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Seed initial data (optional): `npm run seed`
- [ ] Verify database connectivity

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and connect project
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   ```bash
   # Add environment variables in Vercel dashboard
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Railway (Recommended for Full-Stack)

#### Prerequisites
- Railway account
- GitHub repository

#### Steps
1. **Create New Project**
   - Connect GitHub repository
   - Select Node.js template

2. **Configure Environment Variables**
   ```bash
   # Add in Railway dashboard
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="..."
   NODE_ENV="production"
   ```

3. **Deploy**
   - Automatic deployment on git push
   - Custom domain configuration available

### Option 3: Docker Deployment

#### Prerequisites
- Docker and Docker Compose installed
- Production server with Docker support

#### Steps
1. **Build Image**
   ```bash
   docker build -t fleetopia-app .
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
         - NODE_ENV=production
       depends_on:
         - postgres
     
     postgres:
       image: postgres:14
       environment:
         - POSTGRES_DB=fleetopia
         - POSTGRES_USER=fleetopia
         - POSTGRES_PASSWORD=${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
   
   volumes:
     postgres_data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Option 4: AWS/GCP/Azure

#### AWS Deployment
1. **EC2 Instance Setup**
   ```bash
   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pm2
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone <your-repo>
   cd fleetopia.co
   
   # Install dependencies
   npm ci --production
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Production Security Configuration

### 1. Environment Variables
```bash
# Required Production Variables
NODE_ENV=production
NEXTAUTH_SECRET="complex-secret-key-minimum-32-characters"
DATABASE_URL="postgresql://..."

# Security Headers
NEXT_PUBLIC_APP_URL="https://your-domain.com"
ALLOWED_ORIGINS="https://your-domain.com,https://api.your-domain.com"
```

### 2. Next.js Security Configuration
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

### 3. Database Security
```sql
-- Create production user with limited privileges
CREATE USER fleetopia_prod WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE fleetopia TO fleetopia_prod;
GRANT USAGE ON SCHEMA public TO fleetopia_prod;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO fleetopia_prod;
```

## 📊 Monitoring and Health Checks

### 1. Health Check Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Database connectivity check
    await prisma.$queryRaw`SELECT 1`;
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version
    });
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
```

### 2. Performance Monitoring
```javascript
// Add to layout.tsx for production monitoring
if (process.env.NODE_ENV === 'production') {
  // Add Sentry, LogRocket, or other monitoring tools
}
```

## 🔧 Performance Optimization

### 1. Build Optimization
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "analyze": "cross-env ANALYZE=true next build"
  }
}
```

### 2. Caching Strategy
```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  experimental: {
    optimizeCss: true,
  }
}
```

## 🚀 Deployment Commands

### Quick Deployment Script
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting Fleetopia.co deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Restart application (PM2)
pm2 restart fleetopia-app

echo "✅ Deployment completed successfully!"
```

### Environment-Specific Deployments
```bash
# Development
npm run dev

# Staging
NODE_ENV=staging npm run build && npm start

# Production
NODE_ENV=production npm run build && npm start
```

## 📋 Post-Deployment Verification

### 1. Functionality Tests
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Dashboard displays data
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] External API integrations function

### 2. Performance Tests
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database query performance
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 3. Security Tests
- [ ] HTTPS enforcement
- [ ] Security headers present
- [ ] No sensitive data exposed
- [ ] API rate limiting active
- [ ] Authentication working
- [ ] Authorization controls functional

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Database Connection Issues
```bash
# Test database connectivity
npx prisma db pull
npx prisma generate
```

#### Environment Variable Issues
```bash
# Verify environment variables
node -e "console.log(process.env.DATABASE_URL ? 'DB configured' : 'DB missing')"
```

### Rollback Procedure
```bash
# Quick rollback to previous version
git reset --hard HEAD~1
npm ci --production
npm run build
pm2 restart fleetopia-app
```

## 📞 Support and Maintenance

### Monitoring Dashboards
- Application health: `/api/health`
- Database status: Prisma Studio
- Performance metrics: Your monitoring tool
- Error tracking: Your error monitoring service

### Maintenance Schedule
- **Daily:** Health checks and monitoring review
- **Weekly:** Security updates and dependency updates
- **Monthly:** Performance optimization and analytics review
- **Quarterly:** Full security audit and backup verification

---

**🎉 Congratulations! Your Fleetopia.co application is now ready for production deployment.**

For additional support, contact: devops@fleetopia.co 