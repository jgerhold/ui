ARGS = $(filter-out $@,$(MAKECMDGOALS))
MAKEFLAGS += --silent

list:
	sh -c "echo; $(MAKE) -p no_targets__ | awk -F':' '/^[a-zA-Z0-9][^\$$#\/\\t=]*:([^=]|$$)/ {split(\$$1,A,/ /);for(i in A)print A[i]}' | grep -v '__\$$' | grep -v 'Makefile'| sort"

## Base Environment

start:
	docker-compose up -d

start-log:
	docker-compose up

stop:
	docker-compose stop

## NODE

first-install: npm-create-cache-volume npm-set-cache-owner npm-install bootstrap

node-shell:
	docker-compose -f docker/docker-compose.node.yml run --rm -u node node /bin/sh

npm-create-cache-volume:
	docker volume create --name=podlove-ui-npm-cache

npm-set-cache-owner:
	docker-compose -f docker/docker-compose.node.yml run --rm -u root node /bin/sh -c 'chown -R node.node /home/node/.npm'

npm-install:
	docker-compose -f docker/docker-compose.node.yml run --rm -u node node npm install

bootstrap:
	docker-compose -f docker/docker-compose.node.yml run --rm -u node node npm run bootstrap

format:
	docker-compose -f docker/docker-compose.node.yml run --rm -u node node npm run format

lint:
	docker-compose -f docker/docker-compose.node.yml run --rm -u node node npm run lint

test:
	docker-compose -f docker/docker-compose.node.yml run --rm -u node node npm run test

test-dev:
	docker-compose -f docker/docker-compose.node.yml run --rm -u node node npm run test:dev

# No mapped ports, start base environment first
player-shell:
	docker-compose -f docker/docker-compose.player.yml run --rm -u node node /bin/sh

webplayer-shell:
	docker-compose -f docker/docker-compose.webplayer.yml run --rm -u node node /bin/sh

player-dev:
	docker-compose -f docker/docker-compose.player.yml run --rm -u node node sh -c 'cd /ui/apps/player && npm run dev'

webplayer-dev:
	docker-compose -f docker/docker-compose.webplayer.yml run --rm -u node node sh -c 'cd /ui/apps/web-player && npm run dev'

storybook-dev:
	docker-compose -f docker/docker-compose.storybook.yml run --rm -u node node sh -c 'cd /ui/packages/components && npm run dev'

docs-webplayer-dev:
	docker-compose -f docker/docker-compose.docs.web-player.yml run --rm -u node node sh -c 'cd /ui/docs/web-player && npm run dev'

# Maps the ports, does not need Base environment
standalone-player-shell:
	docker-compose -f docker/docker-compose.player.yml run --service-ports --rm -u node node /bin/sh

standalone-webplayer-shell:
	docker-compose -f docker/docker-compose.webplayer.yml run --service-ports --rm -u node node /bin/sh

standalone-player-dev:
	docker-compose -f docker/docker-compose.player.yml run --service-ports --rm -u node node sh -c 'cd /ui/apps/player && npm run dev'

standalone-webplayer-dev:
	docker-compose -f docker/docker-compose.webplayer.yml run --service-ports --rm -u node node sh -c 'cd /ui/apps/web-player && npm run dev'

#############################
# Argument fix workaround
#############################
%:
	@:
