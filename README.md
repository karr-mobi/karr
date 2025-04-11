# **Karr**

**The federated carpool platform**

[![Karr CI](https://github.com/finxol/karr/actions/workflows/pipeline.yml/badge.svg)](https://github.com/finxol/karr/actions/workflows/pipeline.yml)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/finxol/karr)](https://github.com/finxol/karr/releases/)

_**Karr**: Car in Breton language._ Not a misspelling ;)

Built with:

- `@karr/api`: Hono, Drizzle, TypeScript, Postgres
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-api))
- `@karr/web`: Next.js
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-web))
- `@karr/caddy`: Caddy server
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-caddy))
- `@karr/auth`: OpenAuth

Documentation: [docs.karr.finxol.io](https://docs.karr.mobi/)

## Roadmap

- [ ] Carpool platform with recurring trips
- [ ] Admin dashboard for instance piloting
- [ ] Federate instances for shared trips
- [ ] Calculate the carbon footprint of a trip (total and per person)

## TODO

- [ ] Add zod validation in Hono
      ([Hono docs](https://github.com/honojs/middleware/tree/main/packages/zod-validator))

- [x] Get auth server running (using OpenAuth)
- [ ] Actually persist user info
- [ ] Build proper auth frontend

- Add tests

    - [x] config
    - [ ] util
    - [ ] api
    - [ ] ui
    - [ ] web
    - [ ] caddy
          (`SITE_ADDRESS=localhost API_PORT=1993 WEB_PORT=3000 caddy validate --config Caddyfile`)

- [ ] Add documentation
