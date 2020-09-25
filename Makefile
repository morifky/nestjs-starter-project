SERVICE_NAME=nestjs-starter-pack
REVISION_ID?=unknown
IMAGE=node:12

DOCKER_RUN=docker run --rm \
	-v $(CURDIR):/workspace/$(SERVICE_NAME) \
	-w /workspace/$(SERVICE_NAME)

buildApplication:
	$(DOCKER_RUN) $(IMAGE) yarn install
	$(DOCKER_RUN) $(IMAGE) yarn build
	docker build --tag="$(SERVICE):$(REVISION_ID)" --tag="$(SERVICE):latest" .

runApplication:
	docker-compose up

stop:
	docker-compose down

clean:
	docker rmi -f $(SERVICE):$(REVISION_ID) $(SERVICE):latest

rebuild:
	docker-compose down
	$(DOCKER_RUN) $(IMAGE) yarn install
	$(DOCKER_RUN) $(IMAGE) yarn build
	docker-compose up