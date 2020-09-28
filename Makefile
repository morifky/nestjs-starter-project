SERVICE_NAME=nestjs-starter-pack
VERSION?=unknown
IMAGE=node:12

DOCKER_RUN=docker run --rm \
	-v $(CURDIR):/workdir/$(SERVICE_NAME) \
	-w /workdir/$(SERVICE_NAME)

buildApplication:
	$(DOCKER_RUN) $(IMAGE) yarn install
	$(DOCKER_RUN) $(IMAGE) yarn build
	docker build --tag="$(SERVICE_NAME):$(VERSION)" --tag="$(SERVICE_NAME):latest" .

runApplication:
	docker-compose up

stop:
	docker-compose down

clean:
	docker rmi -f $(SERVICE_NAME):$(VERSION) $(SERVICE_NAME):latest

rebuildApplication:
	docker-compose down
	$(DOCKER_RUN) $(IMAGE) yarn install
	$(DOCKER_RUN) $(IMAGE) yarn build
	docker-compose up