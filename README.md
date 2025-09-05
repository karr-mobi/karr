# **Karr**

**The federated carpool platform**

[![Karr CI](https://github.com/finxol/karr/actions/workflows/pipeline.yml/badge.svg)](https://github.com/finxol/karr/actions/workflows/pipeline.yml)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/finxol/karr)](https://github.com/finxol/karr/releases/)

_**Karr**: Car in Breton language._ Not a misspelling ;)

Built with:

- `@karr/auth-server` and `@karr/auth`: OpenAuth
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-auth-server))
- `@karr/web`: Next.js, ORPC, Drizzle, PostgreSQL
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-web))
- `@karr/caddy`: Caddy server
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-caddy))
- `@karr/docs`: Astro Starlight
- `@karr/kv`: Unstorage, Deno KV / SQLite

Documentation: [docs.karr.mobi](https://docs.karr.mobi/)

## Roadmap

- [ ] Carpool platform with recurring trips
- [x] Basic admin dashboard for instance piloting
- [ ] Federate instances for shared trips
- [ ] Calculate the carbon footprint of a trip (total and per person)

## TODO

- [ ] Fix `AUTH_ISSUER` computation in auth-server docker container

- Add tests
    - [x] config
    - [x] util
    - [ ] api
    - [ ] ui
    - [ ] web
    - [ ] caddy
          (`SITE_ADDRESS=localhost API_PORT=1993 WEB_PORT=3000 caddy validate --config Caddyfile`)

- [ ] Improve/update documentation
