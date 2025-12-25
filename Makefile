.PHONY: help setup start stop restart logs clean db-migrate db-reset

help:
	@echo "Available commands:"
	@echo "  make setup       - Initial setup (copy env, install deps)"
	@echo "  make start       - Start all Docker containers"
	@echo "  make stop        - Stop all containers"
	@echo "  make restart     - Restart all containers"
	@echo "  make logs        - Show logs from all containers"
	@echo "  make logs-web    - Show Next.js logs"
	@echo "  make logs-n8n    - Show n8n logs"
	@echo "  make logs-comfyui - Show ComfyUI logs"
	@echo "  make clean       - Remove all containers and volumes (WARNING: deletes data)"
	@echo "  make db-migrate  - Run Prisma migrations"
	@echo "  make db-reset    - Reset database and run migrations"
	@echo "  make db-studio   - Open Prisma Studio"

setup:
	@echo "Setting up project..."
	cp .env.example .env
	@echo "Please edit .env file with your Stripe keys"
	cd apps/web && npm install
	@echo "Setup complete! Run 'make start' to begin"

start:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "Services started!"
	@echo "Web app: http://localhost:3000"
	@echo "n8n: http://localhost:5678"
	@echo "MinIO: http://localhost:9001"
	@echo "Mailhog: http://localhost:8025"
	@echo "ComfyUI: http://localhost:8188"

stop:
	@echo "Stopping all services..."
	docker-compose down

restart:
	@echo "Restarting all services..."
	docker-compose restart

logs:
	docker-compose logs -f

logs-web:
	docker-compose logs -f web

logs-n8n:
	docker-compose logs -f n8n

logs-comfyui:
	docker-compose logs -f comfyui

clean:
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "Cleaned!"; \
	fi

db-migrate:
	cd apps/web && npx prisma migrate dev

db-reset:
	cd apps/web && npx prisma migrate reset

db-studio:
	cd apps/web && npx prisma studio
