# Podlove UI – Docker environment

## Getting Started

- copy `env.default` to `.env` and modify the settings if needed.
- there is a `Makefile` for the commonly needed commands.
  
### Standalone Player example

- run `make first-install`
- run `make standalone-player-dev`
- connect to the player on `http://localhost:9000` (Or the PODLOVE_UI_PLAYER_DEV_PORT you configured in the `.env`file.)
- connect to jarvis on `http://localhost:1337` (Or the PODLOVE_UI_PLAYER_JARVIS_PORT you configured in the `.env`file.)
  
### Using a custom domain to access the player

If you want to access the player via a custom domain instead of localhost:<port> you can follow these steps:

- configure the domain in `.env` (default: podlove-ui.test)
- you need to setup your local system to resolve this domain to the local machine (=> 127.0.0.1). You can do this via a hosts file or use a more modular approach vua a local dns resolver. See below for an example how to set this up on a Mac.
- start the routing proxy with `make start` (`make start-log` to get the container logs)
- see the status of the traefik proxy on `http://localhost:8080/dashboard/` 
- start the player `make player-dev`
- access the player on `http://player-dev.podlove-ui.test` (or the base domain you chose)
- access the webpack jarvis on `http://player-jarvis.podlove-ui.test`
- start the webplayer `make webplayer-dev`
- access the webplayer embed example on `http://webplayer-dev.podlove-ui.test` (or the base domain you chose)
- access the webplayer share example on `http://webplayer-dev.podlove-ui.test/share.html?episode=<url>` (or the base domain you chose)


## podlove-ui.test resolving on a Mac

We will be using homebrew and dnsmasqd

- Create a file /etc/resolver/test (You will need Admin privileges to do so.) with content: `nameserver 127.0.0.1`. This will tell your system to resolve all `*.test`domains via a dns server on your local machine
- install dnsmasqd via homebrew: `brew install dnsmasq`
- create a wildcard entry for .test to resolve all domains to 127.0.0.1: file `/usr/local/etc/dnsmasq.d/test.conf` with content: `address=/.test/127.0.0.1`
- Dnsmasq restart `sudo brew services restart dnsmasq`
