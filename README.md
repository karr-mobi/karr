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
- `@karr/auth`: Ory Kratos + Oathkeeper (or OpenAuth)

Documentation: [docs.karr.finxol.io](https://docs.karr.finxol.io/)

## Roadmap

- [ ] Carpool platform with recurring trips
- [ ] Admin dashboard for instance piloting
- [ ] Federate instances for shared trips
- [ ] Calculate the carbon footprint of a trip (total and per person)

## TODO

- [x] Get deployment working

    - [x] Get Tailwind included working in production build
    - [x] Get automatic build working
    - [ ] Deploy automatically
          ([Directly in GH actions](https://github.com/marketplace/actions/docker-stack-deploy-action),
          inspired from
          [Zenstats](https://github.com/dreamsofcode-io/zenstats/blob/main/.github/workflows/pipeline.yaml))
    - [ ] Add versioning ([Changesets](https://github.com/changesets/changesets))

- [ ] Add zod validation in Hono
      ([Hono docs](https://github.com/honojs/middleware/tree/main/packages/zod-validator))

    - [ ] Env type-safety [T3 env](https://env.t3.gg/docs/nextjs)

- [x] Add mock login
    - [x] Add i18n
          [info in Nextjs docs](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [x] Add trip search route that gives fake, not-searched data
- [x] Add demo client for PoC

- [x] Minify API Docker container

- [ ] Get auth server running (using Ory Kratos/Oathkeeper, with JWT)
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
