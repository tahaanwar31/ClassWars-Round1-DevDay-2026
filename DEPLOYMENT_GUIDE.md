# ClassWars - Production Deployment Guide

Complete guide for deploying ClassWars to production.

## Prerequisites

- Domain name (e.g., classwars.com)
- Server with Node.js 18+ (VPS, AWS EC2, DigitalOcean, etc.)
- MongoDB Atlas account (or self-hosted MongoDB)
- SSL certificate (Let's Encrypt recommended)

## Architecture Overview

```
Internet
   │
   ├─→ classwars.com (Frontend)
   ├─→ api.classwars.com (Backend API)
   └─→ admin.classwars.com (Admin Dashboard)
```

## Step 1: MongoDB Setup (MongoDB Atlas)

1. **Create Cluster**
   ```
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free M0 cluster
   - Choose region closest to your server
   ```

2. **Configure Access**
   ```
   - Database Access: Create user with password
   - Network Access: Add your server IP (or 0.0.0.0/0 for testing)
   ```

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/classwars?retryWrites=true&w=majority
   ```

## Step 2: Server Setup

### Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

## Step 3: Deploy Backend

### 1. Clone and Build

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> classwars
cd classwars/backend

# Install dependencies
npm install --production

# Create production .env
nano .env
```

### 2. Configure Environment

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/classwars
JWT_SECRET=<generate-strong-secret-here>
PORT=5000
NODE_ENV=production
```

Generate strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Build and Seed

```bash
npm run build
npm run seed
```

### 4. Start with PM2

```bash
pm2 start dist/main.js --name classwars-backend
pm2 save
pm2 startup
```

### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/api.classwars.com
```

```nginx
server {
    listen 80;
    server_name api.classwars.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/api.classwars.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Enable SSL

```bash
sudo certbot --nginx -d api.classwars.com
```

## Step 4: Deploy Admin Dashboard

### 1. Build

```bash
cd /var/www/classwars/admin-dashboard

# Update API URL
nano src/api/axios.ts
# Change baseURL to: https://api.classwars.com

npm install
npm run build
```

### 2. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/admin.classwars.com
```

```nginx
server {
    listen 80;
    server_name admin.classwars.com;
    root /var/www/classwars/admin-dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/admin.classwars.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Enable SSL

```bash
sudo certbot --nginx -d admin.classwars.com
```

## Step 5: Deploy Frontend

### 1. Build

```bash
cd /var/www/classwars

# Update API URL if needed
# (Frontend currently uses hardcoded questions, but if you integrate API)

npm install
npm run build
```

### 2. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/classwars.com
```

```nginx
server {
    listen 80;
    server_name classwars.com www.classwars.com;
    root /var/www/classwars/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/classwars.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Enable SSL

```bash
sudo certbot --nginx -d classwars.com -d www.classwars.com
```

## Step 6: Update Backend CORS

```bash
cd /var/www/classwars/backend
nano src/main.ts
```

Update CORS configuration:
```typescript
app.enableCors({
  origin: [
    'https://classwars.com',
    'https://www.classwars.com',
    'https://admin.classwars.com'
  ],
  credentials: true,
});
```

Rebuild and restart:
```bash
npm run build
pm2 restart classwars-backend
```

## Step 7: Create Admin Account

```bash
curl -X POST https://api.classwars.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@classwars.com","password":"<strong-password>"}'
```

## Step 8: Security Hardening

### 1. Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. MongoDB Security

- Enable authentication
- Use strong passwords
- Whitelist only server IP
- Enable encryption at rest

### 4. Environment Variables

```bash
# Secure .env file
chmod 600 /var/www/classwars/backend/.env
```

### 5. Rate Limiting

Install rate limiting in backend:
```bash
cd /var/www/classwars/backend
npm install @nestjs/throttler
```

Update app.module.ts:
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    // ... other imports
  ],
})
```

## Step 9: Monitoring & Logging

### 1. PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. View Logs

```bash
pm2 logs classwars-backend
pm2 monit
```

### 3. Nginx Logs

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Step 10: Backup Strategy

### 1. MongoDB Backup

```bash
# Create backup script
nano /root/backup-mongodb.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/classwars" \
  --out="/backups/mongodb_$DATE"
find /backups -type d -mtime +7 -exec rm -rf {} +
```

```bash
chmod +x /root/backup-mongodb.sh
crontab -e
# Add: 0 2 * * * /root/backup-mongodb.sh
```

### 2. Code Backup

```bash
# Backup code
tar -czf /backups/classwars_$(date +%Y%m%d).tar.gz /var/www/classwars
```

## Step 11: Auto-Deploy with Git

### 1. Setup Git Hook

```bash
cd /var/www/classwars
nano deploy.sh
```

```bash
#!/bin/bash
git pull origin main

# Backend
cd backend
npm install --production
npm run build
pm2 restart classwars-backend

# Admin Dashboard
cd ../admin-dashboard
npm install
npm run build

# Frontend
cd ..
npm install
npm run build

echo "Deployment complete!"
```

```bash
chmod +x deploy.sh
```

## Step 12: Health Checks

### 1. Backend Health Endpoint

Add to backend:
```typescript
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date() };
}
```

### 2. Monitoring Script

```bash
nano /root/health-check.sh
```

```bash
#!/bin/bash
if ! curl -f https://api.classwars.com/health > /dev/null 2>&1; then
    pm2 restart classwars-backend
    echo "Backend restarted at $(date)" >> /var/log/health-check.log
fi
```

```bash
chmod +x /root/health-check.sh
crontab -e
# Add: */5 * * * * /root/health-check.sh
```

## Step 13: Performance Optimization

### 1. Enable Gzip in Nginx

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. Enable HTTP/2

```nginx
listen 443 ssl http2;
```

### 3. Add Caching Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Step 14: SSL Auto-Renewal

Certbot auto-renewal is enabled by default. Test it:

```bash
sudo certbot renew --dry-run
```

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Server provisioned and secured
- [ ] Node.js and dependencies installed
- [ ] Backend deployed and running
- [ ] Admin dashboard deployed
- [ ] Frontend deployed
- [ ] SSL certificates installed
- [ ] CORS configured correctly
- [ ] Admin account created
- [ ] Firewall configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
- [ ] Performance optimizations applied
- [ ] DNS records configured

## DNS Configuration

Point your domains to server IP:

```
A     classwars.com           → <server-ip>
A     www.classwars.com       → <server-ip>
A     api.classwars.com       → <server-ip>
A     admin.classwars.com     → <server-ip>
```

## Troubleshooting

### Backend Not Starting
```bash
pm2 logs classwars-backend
# Check for MongoDB connection errors
```

### 502 Bad Gateway
```bash
# Check if backend is running
pm2 status
# Check Nginx config
sudo nginx -t
```

### CORS Errors
- Verify CORS origins in backend/src/main.ts
- Check browser console for exact error

### SSL Issues
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

## Maintenance

### Update Application
```bash
cd /var/www/classwars
./deploy.sh
```

### View Logs
```bash
pm2 logs classwars-backend
tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
pm2 restart classwars-backend
sudo systemctl restart nginx
```

## Cost Estimation

- **MongoDB Atlas**: Free (M0 tier)
- **Server**: $5-10/month (DigitalOcean, Vultr)
- **Domain**: $10-15/year
- **SSL**: Free (Let's Encrypt)

**Total**: ~$60-120/year

## Support

For issues:
1. Check logs: `pm2 logs`
2. Check Nginx: `sudo nginx -t`
3. Check MongoDB connection
4. Review API_DOCUMENTATION.md

## Conclusion

Your ClassWars application is now deployed and production-ready! 🚀
