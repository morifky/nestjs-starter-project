SERVICE=nestjs-starter-pack
SERVICE_PATH=$(SERVICE)
REVISION_ID?=unknown
BUILDER_IMAGE=node:12

RUN=docker run --rm \
	-v $(CURDIR):/workspace/$(SERVICE_PATH) \
	-w /workspace/$(SERVICE_PATH)

build:
	$(RUN) $(BUILDER_IMAGE) npm rebuild --update-binary
	$(RUN) $(BUILDER_IMAGE) yarn install
	$(RUN) $(BUILDER_IMAGE) yarn build
	docker build --tag="$(SERVICE):$(REVISION_ID)" --tag="$(SERVICE):latest" .

run:
	docker-compose up

stop:
	docker-compose down

clean:
	docker rmi -f $(SERVICE):$(REVISION_ID) $(SERVICE):latest

rebuild:
	docker-compose down
	$(RUN) $(BUILDER_IMAGE) npm rebuild --update-binary
	$(RUN) $(BUILDER_IMAGE) yarn install
	$(RUN) $(BUILDER_IMAGE) yarn build
	docker-compose up