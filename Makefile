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

first-install: npm-install bootstrap

node-shell:
	docker-compose -f docker-compose.node.yml run --rm -u node node /bin/sh

npm-install:
	docker-compose -f docker-compose.node.yml run --rm -u node node npm install

bootstrap:
	docker-compose -f docker-compose.node.yml run --rm -u node node npm run bootstrap

format:
	docker-compose -f docker-compose.node.yml run --rm -u node node npm run format

lint:
	docker-compose -f docker-compose.node.yml run --rm -u node node npm run lint

test:
	docker-compose -f docker-compose.node.yml run --rm -u node node npm run test

test-dev:
	docker-compose -f docker-compose.node.yml run --rm -u node node npm run test:dev

# No mapped ports, start base environment first
player-shell:
	docker-compose -f docker-compose.player.yml run --rm -u node node /bin/sh

webplayer-shell:
	docker-compose -f docker-compose.webplayer.yml run --rm -u node node /bin/sh

player-dev:
	docker-compose -f docker-compose.player.yml run --rm -u node node sh -c 'cd /ui/apps/player && npm run dev'

webplayer-dev:
	docker-compose -f docker-compose.webplayer.yml run --rm -u node node sh -c 'cd /ui/apps/web-player && npm run dev'

# Maps the ports, does not need Base environment
standalone-player-shell:
	docker-compose -f docker-compose.player.yml run --service-ports --rm -u node node /bin/sh

standalone-webplayer-shell:
	docker-compose -f docker-compose.webplayer.yml run --service-ports --rm -u node node /bin/sh

standalone-player-dev:
	docker-compose -f docker-compose.player.yml run --service-ports --rm -u node node sh -c 'cd /ui/apps/player && npm run dev'

standalone-webplayer-dev:
	docker-compose -f docker-compose.webplayer.yml run --service-ports --rm -u node node sh -c 'cd /ui/apps/web-player && npm run dev'

#############################
# Argument fix workaround
#############################
%:
	@:
