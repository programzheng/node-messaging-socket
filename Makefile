SHELL := /bin/bash
#讀取.env
include .env
export $(shell sed 's/=.*//' ./.env)

#當前年-月-日
date=$(shell date +"%F")
COMPOSE=docker-compose
MAIN_SERVICE=app
SERVICES=app

sh:
	$(COMPOSE) exec $(MAIN_SERVICE) sh

bash:
	$(COMPOSE) exec $(MAIN_SERVICE) bash

#重新編譯
dev:
	$(COMPOSE) build $(SERVICES)
	$(COMPOSE) up $(SERVICES)

#啟動服務
up:
	$(COMPOSE) up -d $(SERVICES)

#重啟服務
restart:
	$(COMPOSE) restart

#初始化
init:
	$(COMPOSE) build --force-rm --no-cache
	$(MAKE) up
#列出容器列表
ps:
	$(COMPOSE) ps

#服務log
#%=service name
logs-%:
	$(COMPOSE) logs $*

#關閉所有服務
down:
	$(COMPOSE) down

#移除多餘的image
prune:
	docker system prune

migrate:
	npx sequelize-cli db:migrate

build-image:
	docker build -t programzheng/node-messaging-socket -f Dockerfile --platform linux/amd64 .

push-image:
	docker push programzheng/node-messaging-socket