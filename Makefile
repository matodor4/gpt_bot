.PHONY: run
run: ## Install all needed tools, e.g. for static checks
	npm run dev

.PHONY: up
up: # up docker containers
	docker-compose --env-file .env.local up -d --no-build --remove-orphans \
		web

.PHONY: down
down:
	docker-compose down --remove-orphans --volumes