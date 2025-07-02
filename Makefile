SERVICE_NAME=nestjs-starter-pack
VERSION=$(shell cat version.json | jq -r .version)
IMAGE=node:22.16.0

DOCKER_RUN=docker run --rm \
	-v $(CURDIR):/workdir/$(SERVICE_NAME) \
	-w /workdir/$(SERVICE_NAME)

installDeps:
	$(DOCKER_RUN) $(IMAGE) yarn install

buildApplication: installDeps
	$(DOCKER_RUN) $(IMAGE) yarn build
	docker build --tag="$(SERVICE_NAME):$(VERSION)" --tag="$(SERVICE_NAME):latest" .

setupHostDirs:
	./setup-host-dirs.sh

runApplication: setupHostDirs installDeps
	VERSION=$(VERSION) docker-compose up -d

testApp:
	$(DOCKER_RUN) $(IMAGE) yarn test

stop:
	docker-compose down

clean:
	docker rmi -f $(SERVICE_NAME):$(VERSION) $(SERVICE_NAME):latest

rebuildApplication:
	docker-compose down
	$(DOCKER_RUN) $(IMAGE) yarn install
	$(DOCKER_RUN) $(IMAGE) yarn build
	docker-compose up