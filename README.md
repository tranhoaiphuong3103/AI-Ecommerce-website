# Virtual Try-On E-commerce Platform

AI-powered e-commerce with virtual try-on video generation using Hugging Face Inference API and n8n automation.

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **AI Video**: Hugging Face Inference API (IDM-VTON + Stable Video Diffusion)
- **Automation**: n8n workflows
- **Storage**: MinIO (S3-compatible)
- **Cache**: Redis
- **Payment**: Stripe
- **Email**: Mailhog (dev)
- **Proxy**: Nginx
- **Container**: Docker Compose

## Prerequisites

- Docker Desktop
- 8GB+ RAM
- 10GB+ disk space
- Hugging Face API key (free at https://huggingface.co/settings/tokens)

## Quick Start

```bash
# 1. Clone repo
git clone https://github.com/hoaiphuongtr/Ecommerce-website.git
cd Ecommerce-website

# 2. Setup environment
cp .env.example .env
# Edit .env and add:
# - Stripe keys from https://dashboard.stripe.com/test/apikeys
# - Hugging Face API key from https://huggingface.co/settings/tokens

# 3. Start all services
make start
# OR: docker-compose up -d

# 4. Install deps & init database
cd apps/web
npm install
npx prisma generate
npx prisma migrate dev --name init

# 5. Access services
# Web: http://localhost:3000
# n8n: http://localhost:5678 (admin/admin123)
# MinIO: http://localhost:9001 (minioadmin/minioadmin)
# Mailhog: http://localhost:8025
# Nginx: http://localhost:8080
```

## n8n Setup

1. Go to http://localhost:5678
2. Login: `admin` / `admin123`
3. Import workflows:
   - **Video Generation**: `apps/n8n/workflows/video-generation-workflow.json`
     - Generates virtual try-on videos via Hugging Face
     - Returns video URL immediately to app (no email)
   - **Order Processing**: `apps/n8n/workflows/order-processing-workflow.json`
     - Sends confirmation emails for successful payments
     - Sends failure notifications for invalid cards/declined payments
4. Configure credentials:
   - **PostgreSQL**: Host=`ecommerce-postgres-temp`, Port=`5432`, DB=`ecommerce`, User/Pass=`postgres`
   - **SMTP**: Host=`ecommerce-mailhog`, Port=`1025`, No auth
5. Activate both workflows

## Project Structure

```
Ecommerce-website/
├── apps/
│   ├── web/              # Next.js app
│   │   ├── src/app/      # Pages & API routes
│   │   ├── prisma/       # Database schema
│   │   └── src/lib/      # Prisma, Redis, MinIO, Stripe clients
│   └── n8n/workflows/    # Workflow templates
├── .docker/              # Docker configs
├── docker-compose.yml
└── Makefile
```

## Useful Commands

```bash
make start        # Start all services
make stop         # Stop all services
make logs         # View all logs
make logs-web     # View Next.js logs
make logs-n8n     # View n8n logs
make db-migrate   # Run migrations
make db-studio    # Open Prisma Studio
make clean        # Remove all (deletes data!)
```

## API Endpoints

- `GET /api/products` - List products
- `POST /api/videos/generate` - Generate try-on video
- `GET /api/videos/generate?videoId=uuid` - Get video status
- `POST /api/checkout` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhooks

## n8n Workflow Ideas

1. **Order Processing** - Confirmations, inventory updates, invoices
2. **Abandoned Cart** - Email reminders (24h/48h/72h)
3. **Customer Engagement** - Follow-ups, review requests
4. **Inventory** - Low stock alerts, auto-reorder
5. **Support** - Auto-categorize tickets, team routing
6. **Marketing** - Social media posts, campaigns
7. **AI Features** - Size recommendations, style matching

See `apps/n8n/workflows/README.md` for details.

## Troubleshooting

**Hugging Face API Errors**
```bash
# Check if API key is set correctly
echo $HUGGINGFACE_API_KEY

# Test API access
curl https://huggingface.co/api/whoami-v2 \
  -H "Authorization: Bearer $HUGGINGFACE_API_KEY"
```

**Database Issues**
```bash
docker logs ecommerce-postgres
docker-compose down -v && docker-compose up -d postgres
```

**n8n Workflow Not Working**
- Check logs: `docker logs ecommerce-n8n`
- Verify workflow is activated
- Test webhook: `curl -X POST http://localhost:8080/webhook/generate-video -H "Content-Type: application/json" -d '{"videoId":"test"}'`

## Important Notes

### No GPU Required
- Hugging Face Inference API runs in the cloud
- No local GPU needed - works on any machine
- Free tier available with rate limits

### Default Credentials (Change in Production!)
- n8n: `admin` / `admin123`
- PostgreSQL: `postgres` / `postgres`
- MinIO: `minioadmin` / `minioadmin`

### Environment Variables
Key vars in `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
HUGGINGFACE_API_KEY=hf_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
N8N_WEBHOOK_URL=http://localhost:8080/webhook/generate-video
```

## Security Checklist (Before Production)

- [ ] Change all default passwords
- [ ] Enable HTTPS
- [ ] Add authentication (NextAuth.js)
- [ ] Set up rate limiting
- [ ] Use production SMTP
- [ ] Enable monitoring (Sentry)
- [ ] Update dependencies regularly

## License

MIT License

---

**Built with Next.js, n8n, and Hugging Face**
