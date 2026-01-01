# Virtual Try-On E-commerce Platform

AI-powered e-commerce with virtual try-on video generation using Replicate AI and n8n automation.

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **AI Video**: Replicate API (IDM-VTON model)
- **Automation**: n8n workflows
- **Storage**: MinIO (S3-compatible)
- **Cache**: Redis
- **Payment**: Stripe
- **Email**: Mailhog (dev)
- **Proxy**: Nginx
- **Container**: Docker Compose

## Prerequisites

- Docker Desktop
- Node.js 18+
- 8GB+ RAM
- 10GB+ disk space
- Replicate API key (free at https://replicate.com)

## Quick Start

```bash
# 1. Clone repo
git clone https://github.com/hoaiphuongtr/AI-Ecommerce-website.git
cd Ecommerce-website

# 2. Setup environment files
# Copy root .env (for Docker services)
cp .env.example .env

# Copy web app .env
cp apps/web/.env.example apps/web/.env

# Edit BOTH .env files and add:
# - Stripe keys from https://dashboard.stripe.com/test/apikeys
# - Replicate API token from https://replicate.com/account/api-tokens

# 3. Start all Docker services
docker-compose up -d

# Wait for services to be healthy (about 30 seconds)
docker ps

# 4. Install dependencies and setup database
cd apps/web
npm install

# 5. Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# 6. (Optional) Seed database with sample products
npm run prisma:seed

# 7. Start the development server
npm run dev
```

## Access Services

Once everything is running, access:

- **Web App**: http://localhost:3000
- **n8n Automation**: http://localhost:5678 (admin/admin123)
- **MinIO Console**: http://localhost:19001 (minioadmin/minioadmin)
- **Mailhog**: http://localhost:8025
- **Nginx Proxy**: http://localhost:8080

## n8n Setup (Optional)

1. Go to http://localhost:5678
2. Login: `admin` / `admin123`
3. Import workflows:
   - **Video Generation**: `apps/n8n/workflows/video-generation-workflow.json`
     - Generates virtual try-on videos via Replicate AI
     - Returns video URL immediately to app
   - **Order Processing**: `apps/n8n/workflows/order-processing-workflow.json`
     - Sends confirmation emails for successful payments
     - Sends failure notifications for invalid cards/declined payments
4. Configure credentials:
   - **PostgreSQL**: Host=`ecommerce-postgres`, Port=`5432`, DB=`ecommerce`, User/Pass=`postgres`
   - **SMTP**: Host=`ecommerce-mailhog`, Port=`1025`, No auth
5. Activate both workflows

## Project Structure

```
Ecommerce-website/
├── apps/
│   ├── web/              # Next.js app
│   │   ├── src/app/      # Pages & API routes
│   │   ├── prisma/       # Database schema & migrations
│   │   ├── src/lib/      # Prisma, Redis, MinIO, Stripe, Replicate clients
│   │   └── .env          # Web app environment variables
│   └── n8n/workflows/    # Workflow templates
├── .docker/              # Docker configs
├── docker-compose.yml    # All services configuration
├── .env                  # Docker services environment variables
└── Makefile              # Convenience commands
```

## Useful Commands

```bash
# Docker services
docker-compose up -d      # Start all services
docker-compose down       # Stop all services
docker-compose logs -f    # View all logs
docker logs ecommerce-web # View Next.js logs
docker logs ecommerce-n8n # View n8n logs

# Database
npm run prisma:studio     # Open Prisma Studio (database GUI)
npm run prisma:migrate    # Run new migrations
npm run prisma:seed       # Seed database with sample data

# Development
npm run dev               # Start Next.js dev server
npm run build             # Build for production
npm run lint:fix          # Fix linting issues
npm run format            # Format code with Biome
```

## Port Configuration

Docker services are mapped to these external ports:

| Service | Internal Port | External Port | Access URL |
|---------|---------------|---------------|------------|
| Next.js | 3000 | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | 15432 | localhost:15432 |
| Redis | 6379 | 16379 | localhost:16379 |
| MinIO API | 9000 | 19000 | http://localhost:19000 |
| MinIO Console | 9001 | 19001 | http://localhost:19001 |
| n8n | 5678 | 5678 | http://localhost:5678 |
| Mailhog SMTP | 1025 | 1025 | localhost:1025 |
| Mailhog Web | 8025 | 8025 | http://localhost:8025 |
| Nginx | 80 | 8080 | http://localhost:8080 |

## API Endpoints

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/videos/generate` - Generate try-on video
- `GET /api/videos/:id` - Get video status
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe payment webhooks

## Environment Variables

### Root `.env` (for Docker services)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

# Redis
REDIS_URL=redis://localhost:6379

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# n8n
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
N8N_WEBHOOK_URL=http://localhost:8080/webhook/generate-video
N8N_ORDER_WEBHOOK_URL=http://localhost:8080/webhook/order-notification

# Email (Mailhog for local testing)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@ecommerce.local

# Replicate AI
REPLICATE_API_TOKEN=r8_your_token_here
```

### `apps/web/.env` (for Next.js app)
```env
# Database (use external port for local development)
DATABASE_URL=postgresql://postgres:postgres@localhost:15432/ecommerce

# Redis (use external port)
REDIS_URL=redis://localhost:16379

# MinIO (use external ports)
MINIO_ENDPOINT=localhost
MINIO_PORT=19000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# Stripe Payment
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Next.js Public URLs
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_MINIO_URL=http://localhost:19000

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Replicate AI
REPLICATE_API_TOKEN=r8_your_token_here

# n8n Webhooks
N8N_WEBHOOK_URL=http://localhost:8080/webhook/generate-video
N8N_ORDER_WEBHOOK_URL=http://localhost:8080/webhook/order-notification
```

## Troubleshooting

### Replicate API Errors
```bash
# Check if API key is set correctly
echo $REPLICATE_API_TOKEN

# Verify your API key at https://replicate.com/account/api-tokens
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker logs ecommerce-postgres

# Restart PostgreSQL
docker-compose restart postgres

# Full database reset (WARNING: deletes all data!)
docker-compose down -v
docker-compose up -d postgres
cd apps/web
npx prisma migrate dev
npm run prisma:seed
```

### Port Already in Use
```bash
# Find what's using the port (example for port 3000)
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### n8n Workflow Not Working
```bash
# Check n8n logs
docker logs ecommerce-n8n -f

# Verify workflow is activated in the n8n UI
# Test webhook manually
curl -X POST http://localhost:8080/webhook/generate-video \
  -H "Content-Type: application/json" \
  -d '{"videoId":"test"}'
```

### Prisma Client Out of Sync
```bash
# Regenerate Prisma client
npx prisma generate

# If migration issues persist
npx prisma migrate reset
npm run prisma:seed
```

## Important Notes

### Default Credentials (Change in Production!)
- n8n: `admin` / `admin123`
- PostgreSQL: `postgres` / `postgres`
- MinIO: `minioadmin` / `minioadmin`

### No GPU Required
- Replicate API runs AI models in the cloud
- No local GPU needed - works on any machine
- Free tier available with rate limits

### Development vs Production
- Local development uses external ports (15432, 16379, 19000, etc.)
- Docker containers communicate internally using default ports
- Update environment variables accordingly when deploying

## n8n Workflow Ideas

1. **Order Processing** - Confirmations, inventory updates, invoices
2. **Abandoned Cart** - Email reminders (24h/48h/72h)
3. **Customer Engagement** - Follow-ups, review requests
4. **Inventory** - Low stock alerts, auto-reorder
5. **Support** - Auto-categorize tickets, team routing
6. **Marketing** - Social media posts, campaigns
7. **AI Features** - Size recommendations, style matching

See `apps/n8n/workflows/README.md` for details.

## License

MIT License

---

**Built with Next.js, n8n, and Replicate AI**
