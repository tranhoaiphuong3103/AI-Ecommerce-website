# Virtual Try-On E-commerce Platform

AI-powered e-commerce with virtual try-on video generation using ComfyUI and n8n automation.

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **AI Video**: ComfyUI + AnimateDiff (local, GPU-required)
- **Automation**: n8n workflows
- **Storage**: MinIO (S3-compatible)
- **Cache**: Redis
- **Payment**: Stripe
- **Email**: Mailhog (dev)
- **Proxy**: Nginx
- **Container**: Docker Compose

## Prerequisites

- Docker Desktop
- NVIDIA GPU + CUDA (for video generation)
- NVIDIA Container Toolkit
- 16GB+ RAM
- 50GB+ disk space

### Install NVIDIA Container Toolkit

```bash
# Ubuntu/Debian
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker

# Verify
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
```

## Quick Start

```bash
# 1. Clone repo
git clone https://github.com/hoaiphuongtr/Ecommerce-website.git
cd Ecommerce-website

# 2. Setup environment
cp .env.example .env
# Edit .env and add Stripe keys from https://dashboard.stripe.com/test/apikeys

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
# ComfyUI: http://localhost:8188
```

## n8n Setup

1. Go to http://localhost:5678
2. Login: `admin` / `admin123`
3. Import workflow: `apps/n8n/workflows/video-generation-workflow.json`
4. Configure credentials:
   - **PostgreSQL**: Host=`postgres`, Port=`5432`, DB=`ecommerce`, User/Pass=`postgres`
   - **SMTP**: Host=`mailhog`, Port=`1025`, No auth
5. Activate workflow

## Download AI Models

```bash
# Method 1: Manual download
docker exec -it ecommerce-comfyui bash
cd models/checkpoints
wget https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors
cd ../animatediff_models
wget https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15_v2.ckpt
exit

# Method 2: Use ComfyUI Manager (recommended)
# Visit http://localhost:8188 and install models via GUI
```

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

**ComfyUI No GPU**
```bash
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
# If fails, reinstall nvidia-container-toolkit
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

### GPU Required
- ComfyUI needs NVIDIA GPU for video generation
- Without GPU: Use cloud APIs (Runway/Luma) or simple FFmpeg animations

### Default Credentials (Change in Production!)
- n8n: `admin` / `admin123`
- PostgreSQL: `postgres` / `postgres`
- MinIO: `minioadmin` / `minioadmin`

### Environment Variables
Key vars in `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
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

**Built with Next.js, n8n, and ComfyUI**
