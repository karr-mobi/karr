# **Karr**

**The federated carpool platform**

_**Karr**: Car in Breton language._ Not a misspelling ;)

Built with:

- `@karr/api`: Hono, Drizzle, TypeScript, Postgres
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-api))
- `@karr/web`: Next.js
- `@karr/caddy`: Caddy server
  ([Docker package](https://github.com/users/finxol/packages/container/package/karr-caddy))
- `@karr/auth`: Ory Kratos + Oathkeeper

## Roadmap

- [ ] Carpool platform with recurring trips
- [ ] Admin dashboard for instance piloting
- [ ] Federate instances for shared trips
- [ ] Calculate the carbon footprint of a trip (total and per person)

## TODO

- [ ] Get deployment working

    - [ ] Get automatic build working
    - [ ] Deploy automatically
          ([Directly in GH actions](https://github.com/marketplace/actions/docker-stack-deploy-action),
          inspired from
          [Zenstats](https://github.com/dreamsofcode-io/zenstats/blob/main/.github/workflows/pipeline.yaml))
    - [ ] Add versioning
          ([Changesets](https://github.com/changesets/changesets))

- [ ] Add mock login
    - [ ] Use clsx ?
    - [ ] Add [Iconify](https://iconify.design/docs/iconify-icon/react.html)
    - [ ] Add i18n
          [info in Nextjs docs](https://nextjs.org/docs/pages/building-your-application/routing/internationalization)
- [ ] Add trip search route that gives fake, not-searched data
- [ ] Add demo client for PoC

- [ ] Minify API Docker container

- [ ] Get auth server running (using Ory Kratos/Oathkeeper, with JWT)
- [ ] Build proper auth frontend

- [ ] Add tests
    - [ ] Env type-safety [T3 env](https://env.t3.gg/docs/nextjs)
- [ ] Add documentation
