# Karr API

_**Open to name suggestions :)**_

_Karr: Car in Breton language._ Not a misspelling ;)

Built with Hono, Drizzle, and TypeScript. Running on Deno.

## Roadmap

- [ ] Carpool platform with recurring trips
- [ ] Admin dashboard for instance piloting
- [ ] Federate instances for shared trips
- [ ] Calculate the carbon footprint of a trip (divide by the number of people)

## TODO

- [x] Get deployment working
  - [ ] Deploy automatically ([Directly in GH actions](https://github.com/marketplace/actions/docker-stack-deploy-action))
  - [ ] Add versioning ([Changesets](https://github.com/changesets/changesets))

- [ ] Add mock login
  - [ ] Use clsx ?
  - [ ] Add [Iconify](https://iconify.design/docs/iconify-icon/react.html)
  - [ ] Add i18n [info in Nextjs docs](https://nextjs.org/docs/pages/building-your-application/routing/internationalization)
- [ ] Add trip search route that gives fake, not-searched data
- [ ] Add demo client for PoC

- [ ] Minify API Docker container

- [ ] Get auth server running (using Ory Kratos/Oathkeeper, with JWT)
- [ ] Build proper auth frontend

- [ ] Add tests
  - [ ] Env type-safety [T3 env](https://env.t3.gg/docs/nextjs)
- [ ] Add documentation
