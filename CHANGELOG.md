# Changelog

## v0.13.10

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.9...v0.13.10)

### 🚀 Enhancements

- Translate auth flow ([#152](https://github.com/karr-mobi/karr/pull/152))

### ❤️ Contributors

- Colin Ozanne <git@colinozanne.fr>

## v0.13.9

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.8...v0.13.9)

## v0.13.8

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.7...v0.13.8)

### 🩹 Fixes

- Don't enforce `RESEND_API_KEY` when in CI ([1c33b18](https://github.com/karr-mobi/karr/commit/1c33b18))

### ❤️ Contributors

- Colin Ozanne <git@colinozanne.fr>

## v0.13.7

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.6...v0.13.7)

### 🚀 Enhancements

- Add email sending with Resend ([#151](https://github.com/karr-mobi/karr/pull/151))

### 🩹 Fixes

- Routing ([4ae2dee](https://github.com/karr-mobi/karr/commit/4ae2dee))

### ❤️ Contributors

- Colin Ozanne <git@colinozanne.fr>

## v0.13.6

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.5...v0.13.6)

### 🩹 Fixes

- Well-known path rewrite ([ac72c72](https://github.com/karr-mobi/karr/commit/ac72c72))

### ❤️ Contributors

- Colin Ozanne <git@colinozanne.fr>

## v0.13.5

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.4...v0.13.5)

## v0.13.4

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.3...v0.13.4)

### 🚀 Enhancements

- Make provider selection part of the web UI ([#150](https://github.com/karr-mobi/karr/pull/150))

### ❤️ Contributors

- Colin Ozanne <git@colinozanne.fr>

## v0.13.3

[compare changes](https://github.com/karr-mobi/karr/compare/v0.13.2...v0.13.3)

### 🩹 Fixes

- Button type ([cb82618](https://github.com/karr-mobi/karr/commit/cb82618))

### 🏡 Chore

- Update repo ([24847e5](https://github.com/karr-mobi/karr/commit/24847e5))
- Change image name ([8822a1b](https://github.com/karr-mobi/karr/commit/8822a1b))
- Fix linting issues ([ea8f8da](https://github.com/karr-mobi/karr/commit/ea8f8da))

### ❤️ Contributors

- Colin Ozanne <git@colinozanne.fr>

## v0.13.2

[compare changes](https://github.com/finxol/karr/compare/v0.13.1...v0.13.2)

### 🚀 Enhancements

- **docs:** Add i18n + sidebar topic separation ([61f764f](https://github.com/finxol/karr/commit/61f764f))
- Use Tanstack Form for new trip form ([#147](https://github.com/finxol/karr/pull/147))

### 🩹 Fixes

- Typo ([0a780fd](https://github.com/finxol/karr/commit/0a780fd))
- Add sharp ([67b6f89](https://github.com/finxol/karr/commit/67b6f89))
- **docs:** Image link ([daaccdc](https://github.com/finxol/karr/commit/daaccdc))
- **docs:** Redirect correctly to default locale ([d2f9e38](https://github.com/finxol/karr/commit/d2f9e38))
- Remove `pkce` option from auth docs ([3e10baa](https://github.com/finxol/karr/commit/3e10baa))
- Balance use of zod v4 beta ([322ad84](https://github.com/finxol/karr/commit/322ad84))
- Add esbuild runtime condition ([843684b](https://github.com/finxol/karr/commit/843684b))
- Mention AUTH_PROVIDERS is now required ([9eaec64](https://github.com/finxol/karr/commit/9eaec64))
- Types ([2720bec](https://github.com/finxol/karr/commit/2720bec))
- Add default config values for CI (not test) ([7c30034](https://github.com/finxol/karr/commit/7c30034))
- Disallow password and code providers in prod ([b9702ce](https://github.com/finxol/karr/commit/b9702ce))
- Auth providers condition narrowing ([74ba6ee](https://github.com/finxol/karr/commit/74ba6ee))

### 💅 Refactors

- Integrate docs site in monorepo ([4f5966c](https://github.com/finxol/karr/commit/4f5966c))

### 📦 Build

- Move to biome for linting ([#145](https://github.com/finxol/karr/pull/145))
- Add toBoolean util ([72f64d0](https://github.com/finxol/karr/commit/72f64d0))
- Fix tests ([bf3a55f](https://github.com/finxol/karr/commit/bf3a55f))
- Fix biome extension config ([d7a6640](https://github.com/finxol/karr/commit/d7a6640))

### 🏡 Chore

- Add api routes extraction script ([c6ec6e5](https://github.com/finxol/karr/commit/c6ec6e5))
- Change text ([460c0f7](https://github.com/finxol/karr/commit/460c0f7))
- Rename scripts ([61ca783](https://github.com/finxol/karr/commit/61ca783))
- Don’t use `process.exit` ([c17dbc2](https://github.com/finxol/karr/commit/c17dbc2))

### 🤖 CI

- Fix script to use ([cefdca1](https://github.com/finxol/karr/commit/cefdca1))
- Fix script order ([42a0c04](https://github.com/finxol/karr/commit/42a0c04))
- Fix triggers ([0b44163](https://github.com/finxol/karr/commit/0b44163))
- Fix script order (with turbo this time) ([79f508b](https://github.com/finxol/karr/commit/79f508b))
- Don’t test db connection in CI ([d45c48e](https://github.com/finxol/karr/commit/d45c48e))
- Add autofix.ci ([af0165d](https://github.com/finxol/karr/commit/af0165d))
- Fix script ordering ([509b161](https://github.com/finxol/karr/commit/509b161))
- Update repo namespace ([a3957bf](https://github.com/finxol/karr/commit/a3957bf))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))
- Finxol ([@finxol](https://github.com/finxol))

## v0.13.1

[compare changes](https://github.com/finxol/karr/compare/v0.13.0...v0.13.1)

### 🩹 Fixes

- Db config loading dedupe ([#144](https://github.com/finxol/karr/pull/144))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))

## v0.13.0

[compare changes](https://github.com/finxol/karr/compare/v0.12.3...v0.13.0)

### 🚀 Enhancements

- Add content-grid utility class + other small changes ([#141](https://github.com/finxol/karr/pull/141))
- Link to docs configuration reference on error ([e721dca](https://github.com/finxol/karr/commit/e721dca))
- ⚠️  Advance towards runtime agnostic system ([#143](https://github.com/finxol/karr/pull/143))

### 💅 Refactors

- Move `tryCatch` inside `utilities.ts` ([f45d60c](https://github.com/finxol/karr/commit/f45d60c))
- Add `tryCatch` tsdoc ([a7a442d](https://github.com/finxol/karr/commit/a7a442d))

### 🏡 Chore

- Remove useless file ([34a3325](https://github.com/finxol/karr/commit/34a3325))

#### ⚠️ Breaking Changes

- ⚠️  Advance towards runtime agnostic system ([#143](https://github.com/finxol/karr/pull/143))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))
- Finxol ([@finxol](https://github.com/finxol))

## v0.12.3

[compare changes](https://github.com/finxol/karr/compare/v0.12.2...v0.12.3)

### 🩹 Fixes

- Google user data types ([2501273](https://github.com/finxol/karr/commit/2501273))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.12.2

[compare changes](https://github.com/finxol/karr/compare/v0.12.1...v0.12.2)

### 🩹 Fixes

- Move hono client creation to next ([5f7fe4c](https://github.com/finxol/karr/commit/5f7fe4c))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.12.1

[compare changes](https://github.com/finxol/karr/compare/v0.12.0...v0.12.1)

### 🩹 Fixes

- Script orders and names ([5ac08b0](https://github.com/finxol/karr/commit/5ac08b0))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.12.0

[compare changes](https://github.com/finxol/karr/compare/v0.11.2...v0.12.0)

### 🚀 Enhancements

- ⚠️  Add tests + get Hono RPC working ([#140](https://github.com/finxol/karr/pull/140))

### 🩹 Fixes

- Return profile id instead of account id for jwt ([f37bf5f](https://github.com/finxol/karr/commit/f37bf5f))
- Center loading indicator boundary ([a09475a](https://github.com/finxol/karr/commit/a09475a))

#### ⚠️ Breaking Changes

- ⚠️  Add tests + get Hono RPC working ([#140](https://github.com/finxol/karr/pull/140))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))
- Finxol ([@finxol](https://github.com/finxol))

## v0.11.2

[compare changes](https://github.com/finxol/karr/compare/v0.11.1...v0.11.2)

### 🩹 Fixes

- Change migrations folder location ([c2c056c](https://github.com/finxol/karr/commit/c2c056c))
- Add pnpm patches ([8d61c80](https://github.com/finxol/karr/commit/8d61c80))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.11.1

[compare changes](https://github.com/finxol/karr/compare/v0.11.0...v0.11.1)

### 🚀 Enhancements

- Add Google auth provider ([#139](https://github.com/finxol/karr/pull/139))

### 🩹 Fixes

- Add nickname to jwt sub + refactor packages ([#138](https://github.com/finxol/karr/pull/138))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))

## v0.11.0

[compare changes](https://github.com/finxol/karr/compare/v0.10.2...v0.11.0)

### 🚀 Enhancements

- ⚠️  Persist user data to db ([#137](https://github.com/finxol/karr/pull/137))

### 🩹 Fixes

- Add github avatar url to image remotePatterns ([12f6f1f](https://github.com/finxol/karr/commit/12f6f1f))
- Adjust theme colours ([ebb102d](https://github.com/finxol/karr/commit/ebb102d))

### 📦 Build

- Automate deps update with custom action ([ac636e5](https://github.com/finxol/karr/commit/ac636e5))

### 🏡 Chore

- Update deps + add socket.dev override ([7122a48](https://github.com/finxol/karr/commit/7122a48))
- Use latest `create-pull-request` version ([3719604](https://github.com/finxol/karr/commit/3719604))
- Add formatting step ([e391099](https://github.com/finxol/karr/commit/e391099))
- Change triggers ([ebf09e6](https://github.com/finxol/karr/commit/ebf09e6))
- Run checks after updating deps ([66f08a0](https://github.com/finxol/karr/commit/66f08a0))
- Make checks separate step ([e14cc9d](https://github.com/finxol/karr/commit/e14cc9d))
- Add step `needs` ([182fa4b](https://github.com/finxol/karr/commit/182fa4b))
- Move back to single step ([112f819](https://github.com/finxol/karr/commit/112f819))
- Write formatting ([7200497](https://github.com/finxol/karr/commit/7200497))

#### ⚠️ Breaking Changes

- ⚠️  Persist user data to db ([#137](https://github.com/finxol/karr/pull/137))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))
- Finxol ([@finxol](https://github.com/finxol))

## v0.10.2

[compare changes](https://github.com/finxol/karr/compare/v0.10.1...v0.10.2)

### 🚀 Enhancements

- Create landing page ([#122](https://github.com/finxol/karr/pull/122))
- Add posthog to landing page ([a4b4ba0](https://github.com/finxol/karr/commit/a4b4ba0))
- Improve auth handling ([#130](https://github.com/finxol/karr/pull/130))

### 🩹 Fixes

- Hopefully get posthog working ([39064cf](https://github.com/finxol/karr/commit/39064cf))
- Passing posthog values (hopefully) ([5143443](https://github.com/finxol/karr/commit/5143443))
- Content and ui tweaks ([#123](https://github.com/finxol/karr/pull/123))
- Restore header background ([a5f5d3c](https://github.com/finxol/karr/commit/a5f5d3c))

### 📦 Build

- Run caddy behind another Caddy ([83d80da](https://github.com/finxol/karr/commit/83d80da))
- **pnpm:** Enforce catalog use + add utils ([#129](https://github.com/finxol/karr/pull/129))
- Adjust turbo config ([b404291](https://github.com/finxol/karr/commit/b404291))

### 🏡 Chore

- Add public dir to avoid errors ([5e60a0d](https://github.com/finxol/karr/commit/5e60a0d))
- Change file in public dir ([8c5c746](https://github.com/finxol/karr/commit/8c5c746))
- Move  dir ([d7adf02](https://github.com/finxol/karr/commit/d7adf02))
- Change demo url ([b3e9326](https://github.com/finxol/karr/commit/b3e9326))
- Update deps ([c6bfacb](https://github.com/finxol/karr/commit/c6bfacb))
- Update turbo ([b1481f8](https://github.com/finxol/karr/commit/b1481f8))
- Update unstorage patch ([777a06e](https://github.com/finxol/karr/commit/777a06e))
- Pin caddy version to 2 ([6a29201](https://github.com/finxol/karr/commit/6a29201))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))
- Finxol ([@finxol](https://github.com/finxol))

## v0.10.1

[compare changes](https://github.com/finxol/karr/compare/v0.10.0...v0.10.1)

### 📦 Build

- Fix Dockerfile env var ([fd351b3](https://github.com/finxol/karr/commit/fd351b3))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.10.0

[compare changes](https://github.com/finxol/karr/compare/v0.9.9...v0.10.0)

### 🚀 Enhancements

- Upgrade zod to v4 beta ([#105](https://github.com/finxol/karr/pull/105))
- Add root loading boundary ([fd37be9](https://github.com/finxol/karr/commit/fd37be9))
- ⚠️  Move logger to separate package ([#120](https://github.com/finxol/karr/pull/120))
- ⚠️  Allow auth method customisation ([#121](https://github.com/finxol/karr/pull/121))

### 🩹 Fixes

- Move react query provider to root layout ([920a3b0](https://github.com/finxol/karr/commit/920a3b0))

### 💅 Refactors

- **formatting:** Change line width to 80 ([a1b5a6b](https://github.com/finxol/karr/commit/a1b5a6b))

### 🏡 Chore

- Update README ([856deab](https://github.com/finxol/karr/commit/856deab))
- Update deps ([fa29fd1](https://github.com/finxol/karr/commit/fa29fd1))
- Update deps ([ceeb754](https://github.com/finxol/karr/commit/ceeb754))
- Update deps ([18338b2](https://github.com/finxol/karr/commit/18338b2))
- Ignore config file ([c4466df](https://github.com/finxol/karr/commit/c4466df))

#### ⚠️ Breaking Changes

- ⚠️  Move logger to separate package ([#120](https://github.com/finxol/karr/pull/120))
- ⚠️  Allow auth method customisation ([#121](https://github.com/finxol/karr/pull/121))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))
- Colin Ozanne ([@finxol](https://github.com/finxol))

## v0.9.9

[compare changes](https://github.com/finxol/karr/compare/v0.9.8...v0.9.9)

### 🚀 Enhancements

- Add marquee animation ([d796615](https://github.com/finxol/karr/commit/d796615))

### 🩹 Fixes

- Spec compliance for openauth patch ([9635383](https://github.com/finxol/karr/commit/9635383))
- Compress logo ([514d311](https://github.com/finxol/karr/commit/514d311))
- Auth middleware redirect ([#104](https://github.com/finxol/karr/pull/104))
- Improve @karr/config import rule ([856e10d](https://github.com/finxol/karr/commit/856e10d))
- **ui:** Adjust fluid type scale ([176ce62](https://github.com/finxol/karr/commit/176ce62))

### 🏡 Chore

- Change `framer-motion` to `motion` ([4331598](https://github.com/finxol/karr/commit/4331598))
- Upgrade deps ([f84ad74](https://github.com/finxol/karr/commit/f84ad74))
- Add path alias ([c8fa75b](https://github.com/finxol/karr/commit/c8fa75b))
- Update `drizzle-zod` ([b7069ee](https://github.com/finxol/karr/commit/b7069ee))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))
- Colin Ozanne ([@finxol](https://github.com/finxol))

## v0.9.8

[compare changes](https://github.com/finxol/karr/compare/v0.9.7...v0.9.8)

### 🏡 Chore

- Add postgres required dep ([db8ad2b](https://github.com/finxol/karr/commit/db8ad2b))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.9.7

[compare changes](https://github.com/finxol/karr/compare/v0.9.6...v0.9.7)

### 🩹 Fixes

- Update auth status check ([206752f](https://github.com/finxol/karr/commit/206752f))

### 🏡 Chore

- Update deps ([19a5515](https://github.com/finxol/karr/commit/19a5515))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.9.6

[compare changes](https://github.com/finxol/karr/compare/v0.9.5...v0.9.6)

### 🩹 Fixes

- Get config to openauth client in Next.js production build ([4bc7d2a](https://github.com/finxol/karr/commit/4bc7d2a))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.9.5

[compare changes](https://github.com/finxol/karr/compare/v0.9.4...v0.9.5)

### 💅 Refactors

- Move auth client logic to separate files ([#95](https://github.com/finxol/karr/pull/95))

### 🏡 Chore

- Remove unused posthog ([0a6393b](https://github.com/finxol/karr/commit/0a6393b))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))
- Finxol ([@finxol](https://github.com/finxol))

## v0.9.4

[compare changes](https://github.com/finxol/karr/compare/v0.9.3...v0.9.4)

### 🩹 Fixes

- Move to sql for openauth + fix patches in docker container ([8030379](https://github.com/finxol/karr/commit/8030379))

### 🏡 Chore

- Remove unused deps ([439b2eb](https://github.com/finxol/karr/commit/439b2eb))

### ❤️ Contributors

- Finxol ([@finxol](https://github.com/finxol))

## v0.9.3

[compare changes](https://github.com/finxol/karr/compare/v0.9.2...v0.9.3)

### 🚀 Enhancements

- **auth:** Setup OpenAuth ([#94](https://github.com/finxol/karr/pull/94))

### 📦 Build

- Move to Biome ([#91](https://github.com/finxol/karr/pull/91))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))

## v0.9.2

[compare changes](https://github.com/finxol/karr/compare/v0.9.1...v0.9.2)

### 🚀 Enhancements

- Better error handling ([#83](https://github.com/finxol/karr/pull/83))

### 🩹 Fixes

- **ui:** Tweak header bar colour
  ([04c670b](https://github.com/finxol/karr/commit/04c670b))

### 📦 Build

- New elsint rule for deps versions
  ([4edffb6](https://github.com/finxol/karr/commit/4edffb6))
- Fix eslint package.json rule ([7343f9e](https://github.com/finxol/karr/commit/7343f9e))

### 🏡 Chore

- Change hooks order ([d18db8c](https://github.com/finxol/karr/commit/d18db8c))
- Update lockfile ([146d8ed](https://github.com/finxol/karr/commit/146d8ed))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))
- Finxol ([@finxol](https://github.com/finxol))

## v0.9.1

[compare changes](https://github.com/finxol/karr/compare/v0.9.0...v0.9.1)

### 🩹 Fixes

- **ui:** Theme colours looked weird ([#66](https://github.com/finxol/karr/pull/66))
- **ui:** Adjustments ([#69](https://github.com/finxol/karr/pull/69))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))

## v0.9.0

[compare changes](https://github.com/finxol/karr/compare/v0.8.5...v0.9.0)

### 🚀 Enhancements

- **ui:** ⚠️ Vastly improve nav bar ([#64](https://github.com/finxol/karr/pull/64))

#### ⚠️ Breaking Changes

- **ui:** ⚠️ Vastly improve nav bar ([#64](https://github.com/finxol/karr/pull/64))

### ❤️ Contributors

- Colin Ozanne ([@finxol](https://github.com/finxol))

## v0.8.5

[compare changes](https://github.com/finxol/karr/compare/v0.8.4...v0.8.5)

### 🚀 Enhancements

- **ui:** Add prorgess indicator component
  ([86b55ef](https://github.com/finxol/karr/commit/86b55ef))
- **ui:** Rebuild UI ([#57](https://github.com/finxol/karr/pull/57))

### 🏡 Chore

- **lint:** Fix config files ([1326e2f](https://github.com/finxol/karr/commit/1326e2f))
- Add typescript `erasableSyntaxOnly` rule
  ([8c19b1a](https://github.com/finxol/karr/commit/8c19b1a))

### ❤️ Contributors

- Colin Ozanne ([@finxol](http://github.com/finxol))
- Finxol ([@finxol](http://github.com/finxol))

## v0.8.4

[compare changes](https://github.com/finxol/karr/compare/v0.8.3...v0.8.4)

### 🚀 Enhancements

- **i18n:** Various i18n fixes ([#32](https://github.com/finxol/karr/pull/32))

### 🩹 Fixes

- Proper hierarchy for h tag ([d1bdccb](https://github.com/finxol/karr/commit/d1bdccb))

### ❤️ Contributors

- Finxol ([@finxol](http://github.com/finxol))
- Colin Ozanne ([@finxol](http://github.com/finxol))

## v0.8.3

[compare changes](https://github.com/finxol/karr/compare/v0.8.2...v0.8.3)

### 🚀 Enhancements

- **config:** Add memoization ([#31](https://github.com/finxol/karr/pull/31))

### 🩹 Fixes

- **i18n:** Use next-intl for links
  ([0149ee9](https://github.com/finxol/karr/commit/0149ee9))
- **ui:** Fix up UI errors ([7af9a7e](https://github.com/finxol/karr/commit/7af9a7e))

### 🏡 Chore

- **tooling:** Fix eslint exec not found + upgrade
  ([4ef1773](https://github.com/finxol/karr/commit/4ef1773))
- **readme:** Add docs link + remove PoC roadmap
  ([eb0639b](https://github.com/finxol/karr/commit/eb0639b))

### ❤️ Contributors

- Colin Ozanne ([@finxol](http://github.com/finxol))
- Finxol ([@finxol](http://github.com/finxol))

## v0.8.2

[compare changes](https://github.com/finxol/karr/compare/v0.8.0...v0.8.2)

### 🚀 Enhancements

- **i18n:** Integrate next-intl for internationalization
  ([#22](https://github.com/finxol/karr/pull/22))

### 🏡 Chore

- **release:** V0.8.1 ([252e574](https://github.com/finxol/karr/commit/252e574))

### ❤️ Contributors

- Finxol <git@finxol.io>
- Martin ([@KimBlazter](http://github.com/KimBlazter))

## v0.8.1

[compare changes](https://github.com/finxol/karr/compare/v0.8.0...v0.8.1)

## v0.8.0

[compare changes](https://github.com/finxol/karr/compare/v0.7.15...v0.8.0)

### 🚀 Enhancements

- **config:** ⚠️ Allow app name customisation
  ([#21](https://github.com/finxol/karr/pull/21))

### 🩹 Fixes

- **version:** Change version release url
  ([a8df0ed](https://github.com/finxol/karr/commit/a8df0ed))

#### ⚠️ Breaking Changes

- **config:** ⚠️ Allow app name customisation
  ([#21](https://github.com/finxol/karr/pull/21))

### ❤️ Contributors

- Colin Ozanne <git@finxol.io>
- Finxol <git@finxol.io>

## v0.7.15

[compare changes](https://github.com/finxol/karr/compare/v0.7.14...v0.7.15)

### 🚀 Enhancements

- **web:** Redirect to auth when logged out
  ([#19](https://github.com/finxol/karr/pull/19))

### 🩹 Fixes

- **web:** Don’t show delete button for federated trips
  ([668cbf8](https://github.com/finxol/karr/commit/668cbf8))

### 🏡 Chore

- Update todo list ([4981fd9](https://github.com/finxol/karr/commit/4981fd9))
- Add react scan ([d515be7](https://github.com/finxol/karr/commit/d515be7))

### ❤️ Contributors

- Colin Ozanne <git@finxol.io>
- Finxol <git@finxol.io>

## v0.7.14

[compare changes](https://github.com/finxol/karr/compare/v0.7.12...v0.7.14)

### 🚀 Enhancements

- **web:** UI enhancements ([#17](https://github.com/finxol/karr/pull/17))

### 🩹 Fixes

- **docker:** Improve compose files
  ([2384226](https://github.com/finxol/karr/commit/2384226))

### 🏡 Chore

- Update deps ([5cd1eec](https://github.com/finxol/karr/commit/5cd1eec))
- **release:** V0.7.13 ([8d5ccf7](https://github.com/finxol/karr/commit/8d5ccf7))

### ❤️ Contributors

- Finxol <git@finxol.io>
- Colin Ozanne <git@finxol.io>

## v0.7.13

[compare changes](https://github.com/finxol/karr/compare/v0.7.12...v0.7.13)

### 🩹 Fixes

- **docker:** Improve compose files
  ([2384226](https://github.com/finxol/karr/commit/2384226))

### 🏡 Chore

- Update deps ([5cd1eec](https://github.com/finxol/karr/commit/5cd1eec))

### ❤️ Contributors

- Finxol <git@finxol.io>

## v0.7.12

[compare changes](https://github.com/finxol/karr/compare/v0.7.11...v0.7.12)

### 🚀 Enhancements

- **trips:** Show email instead of id on results
  ([e77ca67](https://github.com/finxol/karr/commit/e77ca67))

### 🩹 Fixes

- **caddy:** Allow to run behind another proxy
  ([#16](https://github.com/finxol/karr/pull/16))

### 🏡 Chore

- **husky:** Fix commit hooks ([1d6a333](https://github.com/finxol/karr/commit/1d6a333))

### ❤️ Contributors

- Colin Ozanne <git@finxol.io>
- Finxol <git@finxol.io>

## v0.7.11

[compare changes](https://github.com/finxol/karr/compare/v0.7.8...v0.7.11)

### 🩹 Fixes

- **trips:** New trip schema validation ([#14](https://github.com/finxol/karr/pull/14))

### 💅 Refactors

- **husky:** Only allow release commit to main
  ([e7f3f34](https://github.com/finxol/karr/commit/e7f3f34))

### 🏡 Chore

- **husky:** Allow release commit only on main
  ([795cf71](https://github.com/finxol/karr/commit/795cf71))

### ❤️ Contributors

- Finxol <git@finxol.io>
- Colin Ozanne <git@finxol.io>

## v0.7.10

[compare changes](https://github.com/finxol/karr/compare/v0.7.8...v0.7.10)

### 🩹 Fixes

- **trips:** New trip schema validation ([#14](https://github.com/finxol/karr/pull/14))

### 💅 Refactors

- **husky:** Only allow release commit to main
  ([e7f3f34](https://github.com/finxol/karr/commit/e7f3f34))

### 🏡 Chore

- **husky:** Allow release commit only on main
  ([795cf71](https://github.com/finxol/karr/commit/795cf71))

### ❤️ Contributors

- Finxol <git@finxol.io>
- Colin Ozanne <git@finxol.io>

## v0.7.9

[compare changes](https://github.com/finxol/karr/compare/v0.7.8...v0.7.9)

### 🩹 Fixes

- **trips:** New trip schema validation ([#14](https://github.com/finxol/karr/pull/14))

### 💅 Refactors

- **husky:** Only allow release commit to main
  ([e7f3f34](https://github.com/finxol/karr/commit/e7f3f34))

### 🏡 Chore

- **husky:** Allow release commit only on main
  ([795cf71](https://github.com/finxol/karr/commit/795cf71))

### ❤️ Contributors

- Finxol <git@finxol.io>
- Colin Ozanne <git@finxol.io>

## v0.7.8

[compare changes](https://github.com/finxol/karr/compare/v0.7.7...v0.7.8)

### 🏡 Chore

- Fix formatting ([26fbbdd](https://github.com/finxol/karr/commit/26fbbdd))

### ❤️ Contributors

- Finxol <git@finxol.io>

## v0.7.7

[compare changes](https://github.com/finxol/karr/compare/v0.7.5...v0.7.7)

### 🚀 Enhancements

- **api:** Add email field to getTrips requests
  ([#13](https://github.com/finxol/karr/pull/13))
- **federation:** Add basic federation for trips
  ([#11](https://github.com/finxol/karr/pull/11))

### 🩹 Fixes

- **auth:** Change success redirect url
  ([25199fc](https://github.com/finxol/karr/commit/25199fc))
- **ui:** Adjust font size ([9e57f89](https://github.com/finxol/karr/commit/9e57f89))

### 🏡 Chore

- Update checklist ([5a7c842](https://github.com/finxol/karr/commit/5a7c842))
- Remove useless logs ([2af4d78](https://github.com/finxol/karr/commit/2af4d78))
- Disallow committing to main ([16741d7](https://github.com/finxol/karr/commit/16741d7))
- Add version ([b8bc6dd](https://github.com/finxol/karr/commit/b8bc6dd))
- Update todo ([647dc7c](https://github.com/finxol/karr/commit/647dc7c))
- Add pr title cheking ([4221477](https://github.com/finxol/karr/commit/4221477))

### ❤️ Contributors

- Colin Ozanne <git@finxol.io>
- Martin ([@KimBlazter](http://github.com/KimBlazter))
- Finxol <git@finxol.io>

## v0.7.6

[compare changes](https://github.com/finxol/karr/compare/v0.7.5...v0.7.6)

### 🚀 Enhancements

- **api:** Add email field to getTrips requests
  ([#13](https://github.com/finxol/karr/pull/13))
- **federation:** Add basic federation for trips
  ([#11](https://github.com/finxol/karr/pull/11))

### 🩹 Fixes

- **auth:** Change success redirect url
  ([25199fc](https://github.com/finxol/karr/commit/25199fc))
- **ui:** Adjust font size ([9e57f89](https://github.com/finxol/karr/commit/9e57f89))

### 🏡 Chore

- Update checklist ([5a7c842](https://github.com/finxol/karr/commit/5a7c842))
- Remove useless logs ([2af4d78](https://github.com/finxol/karr/commit/2af4d78))
- Disallow committing to main ([16741d7](https://github.com/finxol/karr/commit/16741d7))
- Add version ([b8bc6dd](https://github.com/finxol/karr/commit/b8bc6dd))
- Update todo ([647dc7c](https://github.com/finxol/karr/commit/647dc7c))
- Add pr title cheking ([4221477](https://github.com/finxol/karr/commit/4221477))

### ❤️ Contributors

- Colin Ozanne <git@finxol.io>
- Martin ([@KimBlazter](http://github.com/KimBlazter))
- Finxol <git@finxol.io>

## v0.7.5

[compare changes](https://github.com/finxol/karr/compare/v0.7.4...v0.7.5)

### 🩹 Fixes

- **form:** Correct error messages display below fields
  ([#6](https://github.com/finxol/karr/pull/6))

### ❤️ Contributors

- Martin ([@KimBlazter](http://github.com/KimBlazter))

## v0.7.4

[compare changes](https://github.com/finxol/karr/compare/v0.7.3...v0.7.4)

### 🚀 Enhancements

- **api:** Build trip add route ([#3](https://github.com/finxol/karr/pull/3))
- **pages:** Create NewTripForm page for creating new trips
  ([18382dc](https://github.com/finxol/karr/commit/18382dc))
- **ui:** Add Calendar, Form, Label, and Popover components from shadcnui
  ([fe5ffc2](https://github.com/finxol/karr/commit/fe5ffc2))
- **ui:** Implement CurrencyInput component
  ([8d75075](https://github.com/finxol/karr/commit/8d75075))
- **trips:** Trips add and delete ([#5](https://github.com/finxol/karr/pull/5))

### 🩹 Fixes

- **trips:** Prevent unnecessary refetching on window focus
  ([fd0513c](https://github.com/finxol/karr/commit/fd0513c))
- **trips:** Prevent unnecessary refetching on window focus
  ([dfc4323](https://github.com/finxol/karr/commit/dfc4323))
- Should fix tests on windows ([503c0f7](https://github.com/finxol/karr/commit/503c0f7))
- Correct absolute path mistake ([e261bad](https://github.com/finxol/karr/commit/e261bad))
- **layout:** Update link to point to the new trips search path
  ([d4c7b98](https://github.com/finxol/karr/commit/d4c7b98))
- **schema:** Enforce minimum price validation and add NewTripInputSchema
  ([ec4ee62](https://github.com/finxol/karr/commit/ec4ee62))

### 💅 Refactors

- **pages:** Reorganize trips pages for better hierarchy
  ([823f209](https://github.com/finxol/karr/commit/823f209))
- **structure:** Move the search folder to trips for better hierarchy
  ([089ba3e](https://github.com/finxol/karr/commit/089ba3e))
- **prettier:** Clean up prettierrc
  ([705af1e](https://github.com/finxol/karr/commit/705af1e))

### 🏡 Chore

- Federated trips are separate step
  ([1e4f5c5](https://github.com/finxol/karr/commit/1e4f5c5))
- **css:** Update shadcn variable
  ([14601ce](https://github.com/finxol/karr/commit/14601ce))
- **config:** Add .prettierrc for better Windows compatibility
  ([202cb12](https://github.com/finxol/karr/commit/202cb12))
- **vscode:** Configure Prettier settings for consistent code formatting
  ([e9b81b2](https://github.com/finxol/karr/commit/e9b81b2))
- Fix vscode prettier config path
  ([c8a711e](https://github.com/finxol/karr/commit/c8a711e))
- Move deps versions to workspace catalog
  ([27f5176](https://github.com/finxol/karr/commit/27f5176))

### ❤️ Contributors

- Colin Ozanne <git@finxol.io>
- Finxol <git@finxol.io>
- Saunier Martin <blasster35@gmail.com>

## v0.7.3

[compare changes](https://github.com/finxol/karr/compare/v0.7.2...v0.7.3)

### 🚀 Enhancements

- **PoC:** Display trips on trips page
  ([e87b037](https://github.com/finxol/karr/commit/e87b037))

### 🏡 Chore

- Comment out unused ([2296b00](https://github.com/finxol/karr/commit/2296b00))

### 🤖 CI

- Adjust trigger ([196c705](https://github.com/finxol/karr/commit/196c705))
- Adjust changelogen config ([6b3497b](https://github.com/finxol/karr/commit/6b3497b))

### ❤️ Contributors

- Finxol <git@finxol.io>

## v0.7.2

[compare changes](https://github.com/finxol/karr/compare/v0.7.1...v0.7.2)

### 🏡 Chore

- Add changelogen ([cebe1fb](https://github.com/finxol/karr/commit/cebe1fb))

### ❤️ Contributors

- Finxol <git@finxol.io>

## v0.7.1

[compare changes](https://github.com/finxol/karr/compare/v0.7.0...v0.7.1)

### 🏡 Chore

- Build release on tag ([2612dbd](https://github.com/finxol/karr/commit/2612dbd))

### ❤️ Contributors

- Finxol <git@finxol.io>

## v0.7.0

### 🚀 Enhancements

- Add initial support for db ([abba8ad](https://github.com/finxol/karr/commit/abba8ad))
- Add fastify-helmet ([61c7b75](https://github.com/finxol/karr/commit/61c7b75))
- Add support for detailed info ([0864cf0](https://github.com/finxol/karr/commit/0864cf0))
- **db:** Use drizzle for database stuff
  ([9818def](https://github.com/finxol/karr/commit/9818def))
- Database connection info using drizzle
  ([f2196c0](https://github.com/finxol/karr/commit/f2196c0))
- Create helper file ([61134ac](https://github.com/finxol/karr/commit/61134ac))
- Add tmp response + improve typing on helper
  ([83ede21](https://github.com/finxol/karr/commit/83ede21))
- **logger:** Specify the file and line that called the logger
  ([6c16944](https://github.com/finxol/karr/commit/6c16944))
- Allow use of unstable Temporal API
  ([7623db5](https://github.com/finxol/karr/commit/7623db5))
- Change Date to Temporal + add warning
  ([612a843](https://github.com/finxol/karr/commit/612a843))
- **db:** Save special status title instead of id + separate first and last name
  ([66a5e75](https://github.com/finxol/karr/commit/66a5e75))
- Move from Fastify to Hono ([670adcb](https://github.com/finxol/karr/commit/670adcb))
- Write email change & verified status check routes
  ([7b54ad7](https://github.com/finxol/karr/commit/7b54ad7))
- Add trip search PoC ([76727ca](https://github.com/finxol/karr/commit/76727ca))
- Check authorization header in middleware
  ([b4d22cd](https://github.com/finxol/karr/commit/b4d22cd))
- New name ([c7af1fd](https://github.com/finxol/karr/commit/c7af1fd))
- Add Husky ([d29fe4e](https://github.com/finxol/karr/commit/d29fe4e))
- Move utilities to single import point
  ([e4e3055](https://github.com/finxol/karr/commit/e4e3055))
- Start building config importer
  ([42ef864](https://github.com/finxol/karr/commit/42ef864))
- Add caddy server ([572f9af](https://github.com/finxol/karr/commit/572f9af))
- **deploy:** Get Docker container working
  ([e6bc36b](https://github.com/finxol/karr/commit/e6bc36b))
- **deploy:** Add container build
  ([298cf9a](https://github.com/finxol/karr/commit/298cf9a))
- **deploy:** Add caddy server image build
  ([460f150](https://github.com/finxol/karr/commit/460f150))
- Add reading db password from file
  ([7007274](https://github.com/finxol/karr/commit/7007274))
- Finish config import ([c607adb](https://github.com/finxol/karr/commit/c607adb))
- **doc:** Add minimal documentation
  ([d570e03](https://github.com/finxol/karr/commit/d570e03))
- **PoC:** Start building UI ([a3dab35](https://github.com/finxol/karr/commit/a3dab35))
- Add Dockerfile for web ([45b1106](https://github.com/finxol/karr/commit/45b1106))
- Add Tanstack Query ([e980e96](https://github.com/finxol/karr/commit/e980e96))
- Attempt to add web to deployment
  ([4ecf6aa](https://github.com/finxol/karr/commit/4ecf6aa))
- Only run build CI jobs on release commit
  ([f8be3ab](https://github.com/finxol/karr/commit/f8be3ab))
- First react query use, display user info
  ([588d022](https://github.com/finxol/karr/commit/588d022))
- Manual dev login change ([36d8e44](https://github.com/finxol/karr/commit/36d8e44))
- Apply drizzle migrations on startup
  ([f6f512a](https://github.com/finxol/karr/commit/f6f512a))
- Add success log level ([28ff55f](https://github.com/finxol/karr/commit/28ff55f))
- Move to pnpm catalog for dependencies
  ([38b08ea](https://github.com/finxol/karr/commit/38b08ea))
- Make config reloadable ([2170b33](https://github.com/finxol/karr/commit/2170b33))
- Save config changes to a config file
  ([6b7c785](https://github.com/finxol/karr/commit/6b7c785))
- Use react compiler ([aac0fc2](https://github.com/finxol/karr/commit/aac0fc2))
- **ui:** Add width prop to Button
  ([6a4a4db](https://github.com/finxol/karr/commit/6a4a4db))
- Add error page ([2516c80](https://github.com/finxol/karr/commit/2516c80))
- Use ofetch for data fetching ([5274286](https://github.com/finxol/karr/commit/5274286))
- **ui:** Add shadcn/ui ([9a0086a](https://github.com/finxol/karr/commit/9a0086a))
- **ui:** Use CUBE CSS method ([44f7c72](https://github.com/finxol/karr/commit/44f7c72))
- **web:** Add blur image load placeholder
  ([7ade10c](https://github.com/finxol/karr/commit/7ade10c))
- **config:** ⚠️ Remake config entirely
  ([4ce55e7](https://github.com/finxol/karr/commit/4ce55e7))
- **db:** Move database stuff to db package
  ([434db0d](https://github.com/finxol/karr/commit/434db0d))
- **settings:** Add settings ([bb39b92](https://github.com/finxol/karr/commit/bb39b92))
- **auth:** Add very basic authentication
  ([77922f5](https://github.com/finxol/karr/commit/77922f5))
- **config:** Remove need for cross-env
  ([3dabce6](https://github.com/finxol/karr/commit/3dabce6))
- Add posthog ([64f49be](https://github.com/finxol/karr/commit/64f49be))

### 🩹 Fixes

- Explicitly specify port and host for listening
  ([7908048](https://github.com/finxol/karr/commit/7908048))
- Move db conn info to db_conn.ts
  ([84a9c07](https://github.com/finxol/karr/commit/84a9c07))
- Log warning only if production
  ([a62037a](https://github.com/finxol/karr/commit/a62037a))
- Api version prefixing ([f1a35c8](https://github.com/finxol/karr/commit/f1a35c8))
- Match profule route with regex
  ([359caec](https://github.com/finxol/karr/commit/359caec))
- Remove deps caching ([7200494](https://github.com/finxol/karr/commit/7200494))
- Use React 19 + fix linting ([45a59a1](https://github.com/finxol/karr/commit/45a59a1))
- Next works better ([c2e646d](https://github.com/finxol/karr/commit/c2e646d))
- **deploy:** Incorrect input for Dockerfile
  ([7e97752](https://github.com/finxol/karr/commit/7e97752))
- **deploy:** Add permission config
  ([a1ae476](https://github.com/finxol/karr/commit/a1ae476))
- **deploy:** Server build Action
  ([50a4c11](https://github.com/finxol/karr/commit/50a4c11))
- **deploy:** Inattentive copy-paste
  ([e49c158](https://github.com/finxol/karr/commit/e49c158))
- **deploy:** Please work this time
  ([4e7e165](https://github.com/finxol/karr/commit/4e7e165))
- Moved Caddyfile ([d64fa8c](https://github.com/finxol/karr/commit/d64fa8c))
- **deploy:** Add wait-for-it to replace depends-on healthcheck
  ([1f08c45](https://github.com/finxol/karr/commit/1f08c45))
- **deploy:** Envvar parsing fix
  ([ecedf67](https://github.com/finxol/karr/commit/ecedf67))
- **deploy:** Apply default envvar values for config checking
  ([aea68c1](https://github.com/finxol/karr/commit/aea68c1))
- **deploy:** Set content type properly for default response
  ([999ab5c](https://github.com/finxol/karr/commit/999ab5c))
- **deploy:** Adjust css ([3373ab8](https://github.com/finxol/karr/commit/3373ab8))
- Adjust format rules ([d39d6cf](https://github.com/finxol/karr/commit/d39d6cf))
- **tooling:** Actually format instead of checking formatting
  ([cf540c5](https://github.com/finxol/karr/commit/cf540c5))
- **config:** Only use node-compatible packages
  ([855cb46](https://github.com/finxol/karr/commit/855cb46))
- **ci:** Move to pnpm ([d88c694](https://github.com/finxol/karr/commit/d88c694))
- **ci:** Add turbo cache ([e5ed574](https://github.com/finxol/karr/commit/e5ed574))
- Docker build ([d42aea0](https://github.com/finxol/karr/commit/d42aea0))
- Try fixing buikd ([c6b5586](https://github.com/finxol/karr/commit/c6b5586))
- Better resolvePath ([3ba80ea](https://github.com/finxol/karr/commit/3ba80ea))
- Tailwind is now properly included in build
  ([79665d2](https://github.com/finxol/karr/commit/79665d2))
- **build:** Attempt to fix deployment
  ([f7e874b](https://github.com/finxol/karr/commit/f7e874b))
- Remove ipv6 specific settings ([c7edfdd](https://github.com/finxol/karr/commit/c7edfdd))
- Also check types in lint action
  ([8272d5b](https://github.com/finxol/karr/commit/8272d5b))
- Change module resolution for API
  ([a2686dc](https://github.com/finxol/karr/commit/a2686dc))
- Disable husky/git hooks in pipeline
  ([24e964b](https://github.com/finxol/karr/commit/24e964b))
- Don’t expose all config ([847f915](https://github.com/finxol/karr/commit/847f915))
- Improve password resolution ([234fd2b](https://github.com/finxol/karr/commit/234fd2b))
- Build deps before generating drizzle migrations
  ([b329748](https://github.com/finxol/karr/commit/b329748))
- Make config route unprotected ([b9cb16e](https://github.com/finxol/karr/commit/b9cb16e))
- Update config import ([5d116f8](https://github.com/finxol/karr/commit/5d116f8))
- **web:** Improve use of tanstack query
  ([f97a0c2](https://github.com/finxol/karr/commit/f97a0c2))
- Add Suspense ([c192619](https://github.com/finxol/karr/commit/c192619))
- Update responseErrorObject argument
  ([ce28104](https://github.com/finxol/karr/commit/ce28104))
- Generate db migrations during development, not build
  ([fbe7e37](https://github.com/finxol/karr/commit/fbe7e37))
- Don't crash server if tables already exist
  ([09cb2b2](https://github.com/finxol/karr/commit/09cb2b2))
- Module resolution ([850361e](https://github.com/finxol/karr/commit/850361e))
- **api:** Properly return error
  ([c26ae70](https://github.com/finxol/karr/commit/c26ae70))
- **api:** Return the app name from config
  ([91ec17f](https://github.com/finxol/karr/commit/91ec17f))
- **ui:** Accessibility ([3bc8da7](https://github.com/finxol/karr/commit/3bc8da7))
- **config:** ⚠️ Tests ([c2879fb](https://github.com/finxol/karr/commit/c2879fb))
- **config:** ⚠️ Move to confbox
  ([decb23e](https://github.com/finxol/karr/commit/decb23e))
- Typos ([f52b49a](https://github.com/finxol/karr/commit/f52b49a))
- **config:** Adapt to docker env
  ([918b6f0](https://github.com/finxol/karr/commit/918b6f0))
- **api:** Auth check ([26e0004](https://github.com/finxol/karr/commit/26e0004))
- Remove bcrypt module ([305c923](https://github.com/finxol/karr/commit/305c923))
- Add cross-env for windows compat
  ([135abe2](https://github.com/finxol/karr/commit/135abe2))
- **config:** Use join for cross compat
  ([8cea298](https://github.com/finxol/karr/commit/8cea298))
- Update lockfile ([845d6a7](https://github.com/finxol/karr/commit/845d6a7))
- Use path.isAbsolute for better cross compat
  ([a02f9dd](https://github.com/finxol/karr/commit/a02f9dd))
- Don’t include config in docker container
  ([e94ddc2](https://github.com/finxol/karr/commit/e94ddc2))
- Posthog provider ([3673e09](https://github.com/finxol/karr/commit/3673e09))
- Don’t include config in Docker
  ([4331fd6](https://github.com/finxol/karr/commit/4331fd6))
- **prettier:** Adapt tailwind plugin to v4
  ([284171f](https://github.com/finxol/karr/commit/284171f))

### 💅 Refactors

- **ui:** Capitalise ui components
  ([4caf6d8](https://github.com/finxol/karr/commit/4caf6d8))
- Remove lint and typechecking from pre-commit
  ([bd38936](https://github.com/finxol/karr/commit/bd38936))
- Change line width to 90 ([a94a78a](https://github.com/finxol/karr/commit/a94a78a))
- **api:** ResponseErrorObject now takes an Error object
  ([b846b62](https://github.com/finxol/karr/commit/b846b62))
- Remove @karr/type, packages now export their types
  ([1355507](https://github.com/finxol/karr/commit/1355507))
- Only format staged files ([9cac0b7](https://github.com/finxol/karr/commit/9cac0b7))
- Only format staged files ([76cedfc](https://github.com/finxol/karr/commit/76cedfc))
- **tooling:** Move to lint-staged
  ([74748e4](https://github.com/finxol/karr/commit/74748e4))
- **util:** Move to tinyrainbow ([2ef2af2](https://github.com/finxol/karr/commit/2ef2af2))
- Format code ([08ea9b6](https://github.com/finxol/karr/commit/08ea9b6))

### 📦 Build

- Add build dependencies for ordering
  ([59ff357](https://github.com/finxol/karr/commit/59ff357))
- Fix task ordering ([58893ab](https://github.com/finxol/karr/commit/58893ab))
- Remove filter ([8f01e42](https://github.com/finxol/karr/commit/8f01e42))
- **tooling:** Fix eslint nextjs config
  ([d9c1ddf](https://github.com/finxol/karr/commit/d9c1ddf))
- **deps:** Move tooling deps to `tooling` catalog
  ([36c7c41](https://github.com/finxol/karr/commit/36c7c41))

### 🏡 Chore

- Create very short README ([7a51550](https://github.com/finxol/karr/commit/7a51550))
- Start init script ([e3b4196](https://github.com/finxol/karr/commit/e3b4196))
- Only create the database ([a9a1026](https://github.com/finxol/karr/commit/a9a1026))
- Rename config consts to uppercase
  ([c4279ee](https://github.com/finxol/karr/commit/c4279ee))
- Rename config consts to uppercase + replace chalk with jsr:@std/fmt
  ([fcfc5dc](https://github.com/finxol/karr/commit/fcfc5dc))
- Replace fastify-cookie with @fastify/cookie
  ([a794702](https://github.com/finxol/karr/commit/a794702))
- Simplify type definitions of columns
  ([aaaff80](https://github.com/finxol/karr/commit/aaaff80))
- Small local dev db setup script
  ([d0b16fc](https://github.com/finxol/karr/commit/d0b16fc))
- Add drizzle, remove deno.lock ([daf9db6](https://github.com/finxol/karr/commit/daf9db6))
- Initial commit ([0a55b20](https://github.com/finxol/karr/commit/0a55b20))
- Add uuid lib ([19712eb](https://github.com/finxol/karr/commit/19712eb))
- **db:** Create helper files for users and accounts
  ([3cb6f8a](https://github.com/finxol/karr/commit/3cb6f8a))
- Explain what db conn test is in console log
  ([feb267f](https://github.com/finxol/karr/commit/feb267f))
- Create more types ([0eba84f](https://github.com/finxol/karr/commit/0eba84f))
- Add do not use alert ([cc0be17](https://github.com/finxol/karr/commit/cc0be17))
- Add start task for production ([1ec2d7b](https://github.com/finxol/karr/commit/1ec2d7b))
- **db:** Adapt to updated schema
  ([662d4c7](https://github.com/finxol/karr/commit/662d4c7))
- Write squeleton for all routes
  ([b7f71ef](https://github.com/finxol/karr/commit/b7f71ef))
- Refactor ([0f13b05](https://github.com/finxol/karr/commit/0f13b05))
- Remove unused import ([416c89b](https://github.com/finxol/karr/commit/416c89b))
- Add types + API_VERSION and ADMIN_EMAIL
  ([039f36d](https://github.com/finxol/karr/commit/039f36d))
- Add tsdoc + robots.txt route ([976b38c](https://github.com/finxol/karr/commit/976b38c))
- Remove unnecessary logs ([ab57bd2](https://github.com/finxol/karr/commit/ab57bd2))
- Add AccountVerified & UserPublicProfile types
  ([1fcb6d5](https://github.com/finxol/karr/commit/1fcb6d5))
- Add updateNickname & selectUserProfileById
  ([f61a4e9](https://github.com/finxol/karr/commit/f61a4e9))
- Move to monorepo ([b728673](https://github.com/finxol/karr/commit/b728673))
- Add lint Action ([7e581c5](https://github.com/finxol/karr/commit/7e581c5))
- Add lint Action ([1c205be](https://github.com/finxol/karr/commit/1c205be))
- Small adjustments ([46be1ce](https://github.com/finxol/karr/commit/46be1ce))
- Add Next.js app scaffold ([c22d787](https://github.com/finxol/karr/commit/c22d787))
- **todo:** Add todo list and start roadmap
  ([b308658](https://github.com/finxol/karr/commit/b308658))
- Add tailwindcss ([b9390dc](https://github.com/finxol/karr/commit/b9390dc))
- Add toInt ([290a390](https://github.com/finxol/karr/commit/290a390))
- Nextjs tests ([4d190bd](https://github.com/finxol/karr/commit/4d190bd))
- Adjustments ([18e921b](https://github.com/finxol/karr/commit/18e921b))
- Add code editor settings ([d7cebcc](https://github.com/finxol/karr/commit/d7cebcc))
- Move to Node + pnpm ([8da9f63](https://github.com/finxol/karr/commit/8da9f63))
- Rename server to caddy ([b251fb2](https://github.com/finxol/karr/commit/b251fb2))
- Add linting in all packages ([31fa4d5](https://github.com/finxol/karr/commit/31fa4d5))
- Move to node ([a39fa03](https://github.com/finxol/karr/commit/a39fa03))
- Updates ([2261eab](https://github.com/finxol/karr/commit/2261eab))
- Add docker package link ([f951276](https://github.com/finxol/karr/commit/f951276))
- Add task ([43f86ea](https://github.com/finxol/karr/commit/43f86ea))
- Add web container build ([cd7342a](https://github.com/finxol/karr/commit/cd7342a))
- Rearrange db schema definitions
  ([d46c32c](https://github.com/finxol/karr/commit/d46c32c))
- Release ([d39fc63](https://github.com/finxol/karr/commit/d39fc63))
- Release ([730d164](https://github.com/finxol/karr/commit/730d164))
- Advance in checklist ([8569479](https://github.com/finxol/karr/commit/8569479))
- Tweak prettier config ([e5522fd](https://github.com/finxol/karr/commit/e5522fd))
- Release ([21e6729](https://github.com/finxol/karr/commit/21e6729))
- Add path alias ([995f5b1](https://github.com/finxol/karr/commit/995f5b1))
- Release ([cd30ff5](https://github.com/finxol/karr/commit/cd30ff5))
- Release ([cbf80cb](https://github.com/finxol/karr/commit/cbf80cb))
- Change log level ([74f682e](https://github.com/finxol/karr/commit/74f682e))
- Add CI pipeline badge ([5b28dd4](https://github.com/finxol/karr/commit/5b28dd4))
- Add types package ([715f2be](https://github.com/finxol/karr/commit/715f2be))
- Release ([13da428](https://github.com/finxol/karr/commit/13da428))
- Release ([57ae7f1](https://github.com/finxol/karr/commit/57ae7f1))
- Release ([7e95510](https://github.com/finxol/karr/commit/7e95510))
- Add commit message linting ([92976e6](https://github.com/finxol/karr/commit/92976e6))
- **ui:** Rename UI components with capital letter
  ([d20a850](https://github.com/finxol/karr/commit/d20a850))
- Release ([5e1416f](https://github.com/finxol/karr/commit/5e1416f))
- Release ([8902942](https://github.com/finxol/karr/commit/8902942))
- Add package versions ([585ea11](https://github.com/finxol/karr/commit/585ea11))
- **web:** Don’t lint on build ([f64f157](https://github.com/finxol/karr/commit/f64f157))
- Release ([a6f24c3](https://github.com/finxol/karr/commit/a6f24c3))
- Release ([e94646c](https://github.com/finxol/karr/commit/e94646c))
- Release ([b726306](https://github.com/finxol/karr/commit/b726306))
- Release ([b01510f](https://github.com/finxol/karr/commit/b01510f))
- Release ([39fa77b](https://github.com/finxol/karr/commit/39fa77b))
- Release ([7458ceb](https://github.com/finxol/karr/commit/7458ceb))
- Release ([bd4715e](https://github.com/finxol/karr/commit/bd4715e))
- Release ([8de58d3](https://github.com/finxol/karr/commit/8de58d3))
- Check deployment in todo ([12f2cf4](https://github.com/finxol/karr/commit/12f2cf4))
- Release ([6feace0](https://github.com/finxol/karr/commit/6feace0))
- Release ([fbe981e](https://github.com/finxol/karr/commit/fbe981e))
- Release ([46e43e5](https://github.com/finxol/karr/commit/46e43e5))
- Release ([6d3fe4c](https://github.com/finxol/karr/commit/6d3fe4c))
- **turbo:** Add turbo generator for new package
  ([f54482b](https://github.com/finxol/karr/commit/f54482b))
- Release ([40ee945](https://github.com/finxol/karr/commit/40ee945))
- **formatting:** Check formatting
  ([0d67f7c](https://github.com/finxol/karr/commit/0d67f7c))
- Release ([c08f851](https://github.com/finxol/karr/commit/c08f851))
- Create FUNDING.yml ([4de5c36](https://github.com/finxol/karr/commit/4de5c36))
- Remove unused file, move file ([4702e24](https://github.com/finxol/karr/commit/4702e24))
- Add PoC roadmap ([0f4b5c5](https://github.com/finxol/karr/commit/0f4b5c5))
- Add license ([bbf696c](https://github.com/finxol/karr/commit/bbf696c))
- Reorder priorities on PoC roadmap
  ([074b561](https://github.com/finxol/karr/commit/074b561))
- **db:** Rename export ([37b85ea](https://github.com/finxol/karr/commit/37b85ea))
- Release ([f8b6c46](https://github.com/finxol/karr/commit/f8b6c46))
- Remove unused imports ([ec2b95b](https://github.com/finxol/karr/commit/ec2b95b))
- Release ([96c3330](https://github.com/finxol/karr/commit/96c3330))
- Update lockfile ([740dd06](https://github.com/finxol/karr/commit/740dd06))
- Release ([4f982ec](https://github.com/finxol/karr/commit/4f982ec))
- Release ([f795e13](https://github.com/finxol/karr/commit/f795e13))
- **lint:** Add config import rule
  ([b49115a](https://github.com/finxol/karr/commit/b49115a))
- Clean up env var list ([77cfe56](https://github.com/finxol/karr/commit/77cfe56))
- Update roadmap ([ac850d3](https://github.com/finxol/karr/commit/ac850d3))
- Release ([547088e](https://github.com/finxol/karr/commit/547088e))
- Release ([cd40fae](https://github.com/finxol/karr/commit/cd40fae))
- Release ([db95fbd](https://github.com/finxol/karr/commit/db95fbd))
- Print db conn info in dev ([72c4294](https://github.com/finxol/karr/commit/72c4294))
- Bump hono version ([7c31d4c](https://github.com/finxol/karr/commit/7c31d4c))

### ✅ Tests

- **util:** Add tests ([5003cf7](https://github.com/finxol/karr/commit/5003cf7))
- **config:** Fix config testing
  ([0a807bb](https://github.com/finxol/karr/commit/0a807bb))

### 🤖 CI

- Update lockfile ([3195c2e](https://github.com/finxol/karr/commit/3195c2e))
- Fix version resolution ([0a41aec](https://github.com/finxol/karr/commit/0a41aec))
- Add check-type script ([fcf3835](https://github.com/finxol/karr/commit/fcf3835))
- Fix type checking ([dd6edf3](https://github.com/finxol/karr/commit/dd6edf3))
- Add pre-push linting and type checking
  ([3aebdc0](https://github.com/finxol/karr/commit/3aebdc0))
- Fix tsconfig root dir ([f8ae85a](https://github.com/finxol/karr/commit/f8ae85a))
- Update lockfile ([6f12cff](https://github.com/finxol/karr/commit/6f12cff))
- Build config before linting web
  ([88fff7a](https://github.com/finxol/karr/commit/88fff7a))
- Add formatting check ([025d8ee](https://github.com/finxol/karr/commit/025d8ee))
- Tmp remove format checking ([0b28752](https://github.com/finxol/karr/commit/0b28752))
- Rename job ([1098955](https://github.com/finxol/karr/commit/1098955))
- Split release pipeline into separate file
  ([b0cafec](https://github.com/finxol/karr/commit/b0cafec))
- Fix copy paste ([70d9658](https://github.com/finxol/karr/commit/70d9658))
- Debug prettier ([a22d870](https://github.com/finxol/karr/commit/a22d870))
- Debug prettier ([3cf46cd](https://github.com/finxol/karr/commit/3cf46cd))
- Debug prettier ([df154db](https://github.com/finxol/karr/commit/df154db))
- Debug prettier ([b610c49](https://github.com/finxol/karr/commit/b610c49))
- Debut prettier ([8076ed4](https://github.com/finxol/karr/commit/8076ed4))
- Debug prettier ([cad8f27](https://github.com/finxol/karr/commit/cad8f27))
- Debug prettier ([4bc4a1a](https://github.com/finxol/karr/commit/4bc4a1a))
- Debug prettier ([9cc5b08](https://github.com/finxol/karr/commit/9cc5b08))
- Fix prettier diff ([496c19a](https://github.com/finxol/karr/commit/496c19a))

#### ⚠️ Breaking Changes

- **config:** ⚠️ Remake config entirely
  ([4ce55e7](https://github.com/finxol/karr/commit/4ce55e7))
- **config:** ⚠️ Tests ([c2879fb](https://github.com/finxol/karr/commit/c2879fb))
- **config:** ⚠️ Move to confbox
  ([decb23e](https://github.com/finxol/karr/commit/decb23e))

### ❤️ Contributors

- Finxol <git@finxol.io>
- Colin Ozanne <git@finxol.io>

## v0.6.0

### 🚀 Enhancements

- Add initial support for db ([abba8ad](https://github.com/finxol/karr/commit/abba8ad))
- Add fastify-helmet ([61c7b75](https://github.com/finxol/karr/commit/61c7b75))
- Add support for detailed info ([0864cf0](https://github.com/finxol/karr/commit/0864cf0))
- **db:** Use drizzle for database stuff
  ([9818def](https://github.com/finxol/karr/commit/9818def))
- Database connection info using drizzle
  ([f2196c0](https://github.com/finxol/karr/commit/f2196c0))
- Create helper file ([61134ac](https://github.com/finxol/karr/commit/61134ac))
- Add tmp response + improve typing on helper
  ([83ede21](https://github.com/finxol/karr/commit/83ede21))
- **logger:** Specify the file and line that called the logger
  ([6c16944](https://github.com/finxol/karr/commit/6c16944))
- Allow use of unstable Temporal API
  ([7623db5](https://github.com/finxol/karr/commit/7623db5))
- Change Date to Temporal + add warning
  ([612a843](https://github.com/finxol/karr/commit/612a843))
- **db:** Save special status title instead of id + separate first and last name
  ([66a5e75](https://github.com/finxol/karr/commit/66a5e75))
- Move from Fastify to Hono ([670adcb](https://github.com/finxol/karr/commit/670adcb))
- Write email change & verified status check routes
  ([7b54ad7](https://github.com/finxol/karr/commit/7b54ad7))
- Add trip search PoC ([76727ca](https://github.com/finxol/karr/commit/76727ca))
- Check authorization header in middleware
  ([b4d22cd](https://github.com/finxol/karr/commit/b4d22cd))
- New name ([c7af1fd](https://github.com/finxol/karr/commit/c7af1fd))
- Add Husky ([d29fe4e](https://github.com/finxol/karr/commit/d29fe4e))
- Move utilities to single import point
  ([e4e3055](https://github.com/finxol/karr/commit/e4e3055))
- Start building config importer
  ([42ef864](https://github.com/finxol/karr/commit/42ef864))
- Add caddy server ([572f9af](https://github.com/finxol/karr/commit/572f9af))
- **deploy:** Get Docker container working
  ([e6bc36b](https://github.com/finxol/karr/commit/e6bc36b))
- **deploy:** Add container build
  ([298cf9a](https://github.com/finxol/karr/commit/298cf9a))
- **deploy:** Add caddy server image build
  ([460f150](https://github.com/finxol/karr/commit/460f150))
- Add reading db password from file
  ([7007274](https://github.com/finxol/karr/commit/7007274))
- Finish config import ([c607adb](https://github.com/finxol/karr/commit/c607adb))
- **doc:** Add minimal documentation
  ([d570e03](https://github.com/finxol/karr/commit/d570e03))
- **PoC:** Start building UI ([a3dab35](https://github.com/finxol/karr/commit/a3dab35))
- Add Dockerfile for web ([45b1106](https://github.com/finxol/karr/commit/45b1106))
- Add Tanstack Query ([e980e96](https://github.com/finxol/karr/commit/e980e96))
- Attempt to add web to deployment
  ([4ecf6aa](https://github.com/finxol/karr/commit/4ecf6aa))
- Only run build CI jobs on release commit
  ([f8be3ab](https://github.com/finxol/karr/commit/f8be3ab))
- First react query use, display user info
  ([588d022](https://github.com/finxol/karr/commit/588d022))
- Manual dev login change ([36d8e44](https://github.com/finxol/karr/commit/36d8e44))
- Apply drizzle migrations on startup
  ([f6f512a](https://github.com/finxol/karr/commit/f6f512a))
- Add success log level ([28ff55f](https://github.com/finxol/karr/commit/28ff55f))
- Move to pnpm catalog for dependencies
  ([38b08ea](https://github.com/finxol/karr/commit/38b08ea))
- Make config reloadable ([2170b33](https://github.com/finxol/karr/commit/2170b33))
- Save config changes to a config file
  ([6b7c785](https://github.com/finxol/karr/commit/6b7c785))
- Use react compiler ([aac0fc2](https://github.com/finxol/karr/commit/aac0fc2))
- **ui:** Add width prop to Button
  ([6a4a4db](https://github.com/finxol/karr/commit/6a4a4db))
- Add error page ([2516c80](https://github.com/finxol/karr/commit/2516c80))
- Use ofetch for data fetching ([5274286](https://github.com/finxol/karr/commit/5274286))
- **ui:** Add shadcn/ui ([9a0086a](https://github.com/finxol/karr/commit/9a0086a))
- **ui:** Use CUBE CSS method ([44f7c72](https://github.com/finxol/karr/commit/44f7c72))
- **web:** Add blur image load placeholder
  ([7ade10c](https://github.com/finxol/karr/commit/7ade10c))
- **config:** ⚠️ Remake config entirely
  ([4ce55e7](https://github.com/finxol/karr/commit/4ce55e7))
- **db:** Move database stuff to db package
  ([434db0d](https://github.com/finxol/karr/commit/434db0d))
- **settings:** Add settings ([bb39b92](https://github.com/finxol/karr/commit/bb39b92))
- **auth:** Add very basic authentication
  ([77922f5](https://github.com/finxol/karr/commit/77922f5))
- **config:** Remove need for cross-env
  ([3dabce6](https://github.com/finxol/karr/commit/3dabce6))
- Add posthog ([64f49be](https://github.com/finxol/karr/commit/64f49be))

### 🩹 Fixes

- Explicitly specify port and host for listening
  ([7908048](https://github.com/finxol/karr/commit/7908048))
- Move db conn info to db_conn.ts
  ([84a9c07](https://github.com/finxol/karr/commit/84a9c07))
- Log warning only if production
  ([a62037a](https://github.com/finxol/karr/commit/a62037a))
- Api version prefixing ([f1a35c8](https://github.com/finxol/karr/commit/f1a35c8))
- Match profule route with regex
  ([359caec](https://github.com/finxol/karr/commit/359caec))
- Remove deps caching ([7200494](https://github.com/finxol/karr/commit/7200494))
- Use React 19 + fix linting ([45a59a1](https://github.com/finxol/karr/commit/45a59a1))
- Next works better ([c2e646d](https://github.com/finxol/karr/commit/c2e646d))
- **deploy:** Incorrect input for Dockerfile
  ([7e97752](https://github.com/finxol/karr/commit/7e97752))
- **deploy:** Add permission config
  ([a1ae476](https://github.com/finxol/karr/commit/a1ae476))
- **deploy:** Server build Action
  ([50a4c11](https://github.com/finxol/karr/commit/50a4c11))
- **deploy:** Inattentive copy-paste
  ([e49c158](https://github.com/finxol/karr/commit/e49c158))
- **deploy:** Please work this time
  ([4e7e165](https://github.com/finxol/karr/commit/4e7e165))
- Moved Caddyfile ([d64fa8c](https://github.com/finxol/karr/commit/d64fa8c))
- **deploy:** Add wait-for-it to replace depends-on healthcheck
  ([1f08c45](https://github.com/finxol/karr/commit/1f08c45))
- **deploy:** Envvar parsing fix
  ([ecedf67](https://github.com/finxol/karr/commit/ecedf67))
- **deploy:** Apply default envvar values for config checking
  ([aea68c1](https://github.com/finxol/karr/commit/aea68c1))
- **deploy:** Set content type properly for default response
  ([999ab5c](https://github.com/finxol/karr/commit/999ab5c))
- **deploy:** Adjust css ([3373ab8](https://github.com/finxol/karr/commit/3373ab8))
- Adjust format rules ([d39d6cf](https://github.com/finxol/karr/commit/d39d6cf))
- **tooling:** Actually format instead of checking formatting
  ([cf540c5](https://github.com/finxol/karr/commit/cf540c5))
- **config:** Only use node-compatible packages
  ([855cb46](https://github.com/finxol/karr/commit/855cb46))
- **ci:** Move to pnpm ([d88c694](https://github.com/finxol/karr/commit/d88c694))
- **ci:** Add turbo cache ([e5ed574](https://github.com/finxol/karr/commit/e5ed574))
- Docker build ([d42aea0](https://github.com/finxol/karr/commit/d42aea0))
- Try fixing buikd ([c6b5586](https://github.com/finxol/karr/commit/c6b5586))
- Better resolvePath ([3ba80ea](https://github.com/finxol/karr/commit/3ba80ea))
- Tailwind is now properly included in build
  ([79665d2](https://github.com/finxol/karr/commit/79665d2))
- **build:** Attempt to fix deployment
  ([f7e874b](https://github.com/finxol/karr/commit/f7e874b))
- Remove ipv6 specific settings ([c7edfdd](https://github.com/finxol/karr/commit/c7edfdd))
- Also check types in lint action
  ([8272d5b](https://github.com/finxol/karr/commit/8272d5b))
- Change module resolution for API
  ([a2686dc](https://github.com/finxol/karr/commit/a2686dc))
- Disable husky/git hooks in pipeline
  ([24e964b](https://github.com/finxol/karr/commit/24e964b))
- Don’t expose all config ([847f915](https://github.com/finxol/karr/commit/847f915))
- Improve password resolution ([234fd2b](https://github.com/finxol/karr/commit/234fd2b))
- Build deps before generating drizzle migrations
  ([b329748](https://github.com/finxol/karr/commit/b329748))
- Make config route unprotected ([b9cb16e](https://github.com/finxol/karr/commit/b9cb16e))
- Update config import ([5d116f8](https://github.com/finxol/karr/commit/5d116f8))
- **web:** Improve use of tanstack query
  ([f97a0c2](https://github.com/finxol/karr/commit/f97a0c2))
- Add Suspense ([c192619](https://github.com/finxol/karr/commit/c192619))
- Update responseErrorObject argument
  ([ce28104](https://github.com/finxol/karr/commit/ce28104))
- Generate db migrations during development, not build
  ([fbe7e37](https://github.com/finxol/karr/commit/fbe7e37))
- Don't crash server if tables already exist
  ([09cb2b2](https://github.com/finxol/karr/commit/09cb2b2))
- Module resolution ([850361e](https://github.com/finxol/karr/commit/850361e))
- **api:** Properly return error
  ([c26ae70](https://github.com/finxol/karr/commit/c26ae70))
- **api:** Return the app name from config
  ([91ec17f](https://github.com/finxol/karr/commit/91ec17f))
- **ui:** Accessibility ([3bc8da7](https://github.com/finxol/karr/commit/3bc8da7))
- **config:** ⚠️ Tests ([c2879fb](https://github.com/finxol/karr/commit/c2879fb))
- **config:** ⚠️ Move to confbox
  ([decb23e](https://github.com/finxol/karr/commit/decb23e))
- Typos ([f52b49a](https://github.com/finxol/karr/commit/f52b49a))
- **config:** Adapt to docker env
  ([918b6f0](https://github.com/finxol/karr/commit/918b6f0))
- **api:** Auth check ([26e0004](https://github.com/finxol/karr/commit/26e0004))
- Remove bcrypt module ([305c923](https://github.com/finxol/karr/commit/305c923))
- Add cross-env for windows compat
  ([135abe2](https://github.com/finxol/karr/commit/135abe2))
- **config:** Use join for cross compat
  ([8cea298](https://github.com/finxol/karr/commit/8cea298))
- Update lockfile ([845d6a7](https://github.com/finxol/karr/commit/845d6a7))
- Use path.isAbsolute for better cross compat
  ([a02f9dd](https://github.com/finxol/karr/commit/a02f9dd))
- Don’t include config in docker container
  ([e94ddc2](https://github.com/finxol/karr/commit/e94ddc2))
- Posthog provider ([3673e09](https://github.com/finxol/karr/commit/3673e09))
- Don’t include config in Docker
  ([4331fd6](https://github.com/finxol/karr/commit/4331fd6))
- **prettier:** Adapt tailwind plugin to v4
  ([284171f](https://github.com/finxol/karr/commit/284171f))

### 💅 Refactors

- **ui:** Capitalise ui components
  ([4caf6d8](https://github.com/finxol/karr/commit/4caf6d8))
- Remove lint and typechecking from pre-commit
  ([bd38936](https://github.com/finxol/karr/commit/bd38936))
- Change line width to 90 ([a94a78a](https://github.com/finxol/karr/commit/a94a78a))
- **api:** ResponseErrorObject now takes an Error object
  ([b846b62](https://github.com/finxol/karr/commit/b846b62))
- Remove @karr/type, packages now export their types
  ([1355507](https://github.com/finxol/karr/commit/1355507))
- Only format staged files ([9cac0b7](https://github.com/finxol/karr/commit/9cac0b7))
- Only format staged files ([76cedfc](https://github.com/finxol/karr/commit/76cedfc))
- **tooling:** Move to lint-staged
  ([74748e4](https://github.com/finxol/karr/commit/74748e4))
- **util:** Move to tinyrainbow ([2ef2af2](https://github.com/finxol/karr/commit/2ef2af2))
- Format code ([08ea9b6](https://github.com/finxol/karr/commit/08ea9b6))

### 📦 Build

- Add build dependencies for ordering
  ([59ff357](https://github.com/finxol/karr/commit/59ff357))
- Fix task ordering ([58893ab](https://github.com/finxol/karr/commit/58893ab))
- Remove filter ([8f01e42](https://github.com/finxol/karr/commit/8f01e42))
- **tooling:** Fix eslint nextjs config
  ([d9c1ddf](https://github.com/finxol/karr/commit/d9c1ddf))
- **deps:** Move tooling deps to `tooling` catalog
  ([36c7c41](https://github.com/finxol/karr/commit/36c7c41))

### 🏡 Chore

- Create very short README ([7a51550](https://github.com/finxol/karr/commit/7a51550))
- Start init script ([e3b4196](https://github.com/finxol/karr/commit/e3b4196))
- Only create the database ([a9a1026](https://github.com/finxol/karr/commit/a9a1026))
- Rename config consts to uppercase
  ([c4279ee](https://github.com/finxol/karr/commit/c4279ee))
- Rename config consts to uppercase + replace chalk with jsr:@std/fmt
  ([fcfc5dc](https://github.com/finxol/karr/commit/fcfc5dc))
- Replace fastify-cookie with @fastify/cookie
  ([a794702](https://github.com/finxol/karr/commit/a794702))
- Simplify type definitions of columns
  ([aaaff80](https://github.com/finxol/karr/commit/aaaff80))
- Small local dev db setup script
  ([d0b16fc](https://github.com/finxol/karr/commit/d0b16fc))
- Add drizzle, remove deno.lock ([daf9db6](https://github.com/finxol/karr/commit/daf9db6))
- Initial commit ([0a55b20](https://github.com/finxol/karr/commit/0a55b20))
- Add uuid lib ([19712eb](https://github.com/finxol/karr/commit/19712eb))
- **db:** Create helper files for users and accounts
  ([3cb6f8a](https://github.com/finxol/karr/commit/3cb6f8a))
- Explain what db conn test is in console log
  ([feb267f](https://github.com/finxol/karr/commit/feb267f))
- Create more types ([0eba84f](https://github.com/finxol/karr/commit/0eba84f))
- Add do not use alert ([cc0be17](https://github.com/finxol/karr/commit/cc0be17))
- Add start task for production ([1ec2d7b](https://github.com/finxol/karr/commit/1ec2d7b))
- **db:** Adapt to updated schema
  ([662d4c7](https://github.com/finxol/karr/commit/662d4c7))
- Write squeleton for all routes
  ([b7f71ef](https://github.com/finxol/karr/commit/b7f71ef))
- Refactor ([0f13b05](https://github.com/finxol/karr/commit/0f13b05))
- Remove unused import ([416c89b](https://github.com/finxol/karr/commit/416c89b))
- Add types + API_VERSION and ADMIN_EMAIL
  ([039f36d](https://github.com/finxol/karr/commit/039f36d))
- Add tsdoc + robots.txt route ([976b38c](https://github.com/finxol/karr/commit/976b38c))
- Remove unnecessary logs ([ab57bd2](https://github.com/finxol/karr/commit/ab57bd2))
- Add AccountVerified & UserPublicProfile types
  ([1fcb6d5](https://github.com/finxol/karr/commit/1fcb6d5))
- Add updateNickname & selectUserProfileById
  ([f61a4e9](https://github.com/finxol/karr/commit/f61a4e9))
- Move to monorepo ([b728673](https://github.com/finxol/karr/commit/b728673))
- Add lint Action ([7e581c5](https://github.com/finxol/karr/commit/7e581c5))
- Add lint Action ([1c205be](https://github.com/finxol/karr/commit/1c205be))
- Small adjustments ([46be1ce](https://github.com/finxol/karr/commit/46be1ce))
- Add Next.js app scaffold ([c22d787](https://github.com/finxol/karr/commit/c22d787))
- **todo:** Add todo list and start roadmap
  ([b308658](https://github.com/finxol/karr/commit/b308658))
- Add tailwindcss ([b9390dc](https://github.com/finxol/karr/commit/b9390dc))
- Add toInt ([290a390](https://github.com/finxol/karr/commit/290a390))
- Nextjs tests ([4d190bd](https://github.com/finxol/karr/commit/4d190bd))
- Adjustments ([18e921b](https://github.com/finxol/karr/commit/18e921b))
- Add code editor settings ([d7cebcc](https://github.com/finxol/karr/commit/d7cebcc))
- Move to Node + pnpm ([8da9f63](https://github.com/finxol/karr/commit/8da9f63))
- Rename server to caddy ([b251fb2](https://github.com/finxol/karr/commit/b251fb2))
- Add linting in all packages ([31fa4d5](https://github.com/finxol/karr/commit/31fa4d5))
- Move to node ([a39fa03](https://github.com/finxol/karr/commit/a39fa03))
- Updates ([2261eab](https://github.com/finxol/karr/commit/2261eab))
- Add docker package link ([f951276](https://github.com/finxol/karr/commit/f951276))
- Add task ([43f86ea](https://github.com/finxol/karr/commit/43f86ea))
- Add web container build ([cd7342a](https://github.com/finxol/karr/commit/cd7342a))
- Rearrange db schema definitions
  ([d46c32c](https://github.com/finxol/karr/commit/d46c32c))
- Release ([d39fc63](https://github.com/finxol/karr/commit/d39fc63))
- Release ([730d164](https://github.com/finxol/karr/commit/730d164))
- Advance in checklist ([8569479](https://github.com/finxol/karr/commit/8569479))
- Tweak prettier config ([e5522fd](https://github.com/finxol/karr/commit/e5522fd))
- Release ([21e6729](https://github.com/finxol/karr/commit/21e6729))
- Add path alias ([995f5b1](https://github.com/finxol/karr/commit/995f5b1))
- Release ([cd30ff5](https://github.com/finxol/karr/commit/cd30ff5))
- Release ([cbf80cb](https://github.com/finxol/karr/commit/cbf80cb))
- Change log level ([74f682e](https://github.com/finxol/karr/commit/74f682e))
- Add CI pipeline badge ([5b28dd4](https://github.com/finxol/karr/commit/5b28dd4))
- Add types package ([715f2be](https://github.com/finxol/karr/commit/715f2be))
- Release ([13da428](https://github.com/finxol/karr/commit/13da428))
- Release ([57ae7f1](https://github.com/finxol/karr/commit/57ae7f1))
- Release ([7e95510](https://github.com/finxol/karr/commit/7e95510))
- Add commit message linting ([92976e6](https://github.com/finxol/karr/commit/92976e6))
- **ui:** Rename UI components with capital letter
  ([d20a850](https://github.com/finxol/karr/commit/d20a850))
- Release ([5e1416f](https://github.com/finxol/karr/commit/5e1416f))
- Release ([8902942](https://github.com/finxol/karr/commit/8902942))
- Add package versions ([585ea11](https://github.com/finxol/karr/commit/585ea11))
- **web:** Don’t lint on build ([f64f157](https://github.com/finxol/karr/commit/f64f157))
- Release ([a6f24c3](https://github.com/finxol/karr/commit/a6f24c3))
- Release ([e94646c](https://github.com/finxol/karr/commit/e94646c))
- Release ([b726306](https://github.com/finxol/karr/commit/b726306))
- Release ([b01510f](https://github.com/finxol/karr/commit/b01510f))
- Release ([39fa77b](https://github.com/finxol/karr/commit/39fa77b))
- Release ([7458ceb](https://github.com/finxol/karr/commit/7458ceb))
- Release ([bd4715e](https://github.com/finxol/karr/commit/bd4715e))
- Release ([8de58d3](https://github.com/finxol/karr/commit/8de58d3))
- Check deployment in todo ([12f2cf4](https://github.com/finxol/karr/commit/12f2cf4))
- Release ([6feace0](https://github.com/finxol/karr/commit/6feace0))
- Release ([fbe981e](https://github.com/finxol/karr/commit/fbe981e))
- Release ([46e43e5](https://github.com/finxol/karr/commit/46e43e5))
- Release ([6d3fe4c](https://github.com/finxol/karr/commit/6d3fe4c))
- **turbo:** Add turbo generator for new package
  ([f54482b](https://github.com/finxol/karr/commit/f54482b))
- Release ([40ee945](https://github.com/finxol/karr/commit/40ee945))
- **formatting:** Check formatting
  ([0d67f7c](https://github.com/finxol/karr/commit/0d67f7c))
- Release ([c08f851](https://github.com/finxol/karr/commit/c08f851))
- Create FUNDING.yml ([4de5c36](https://github.com/finxol/karr/commit/4de5c36))
- Remove unused file, move file ([4702e24](https://github.com/finxol/karr/commit/4702e24))
- Add PoC roadmap ([0f4b5c5](https://github.com/finxol/karr/commit/0f4b5c5))
- Add license ([bbf696c](https://github.com/finxol/karr/commit/bbf696c))
- Reorder priorities on PoC roadmap
  ([074b561](https://github.com/finxol/karr/commit/074b561))
- **db:** Rename export ([37b85ea](https://github.com/finxol/karr/commit/37b85ea))
- Release ([f8b6c46](https://github.com/finxol/karr/commit/f8b6c46))
- Remove unused imports ([ec2b95b](https://github.com/finxol/karr/commit/ec2b95b))
- Release ([96c3330](https://github.com/finxol/karr/commit/96c3330))
- Update lockfile ([740dd06](https://github.com/finxol/karr/commit/740dd06))
- Release ([4f982ec](https://github.com/finxol/karr/commit/4f982ec))
- Release ([f795e13](https://github.com/finxol/karr/commit/f795e13))
- **lint:** Add config import rule
  ([b49115a](https://github.com/finxol/karr/commit/b49115a))
- Clean up env var list ([77cfe56](https://github.com/finxol/karr/commit/77cfe56))
- Update roadmap ([ac850d3](https://github.com/finxol/karr/commit/ac850d3))
- Release ([547088e](https://github.com/finxol/karr/commit/547088e))
- Release ([cd40fae](https://github.com/finxol/karr/commit/cd40fae))
- Release ([db95fbd](https://github.com/finxol/karr/commit/db95fbd))

### ✅ Tests

- **util:** Add tests ([5003cf7](https://github.com/finxol/karr/commit/5003cf7))
- **config:** Fix config testing
  ([0a807bb](https://github.com/finxol/karr/commit/0a807bb))

### 🤖 CI

- Update lockfile ([3195c2e](https://github.com/finxol/karr/commit/3195c2e))
- Fix version resolution ([0a41aec](https://github.com/finxol/karr/commit/0a41aec))
- Add check-type script ([fcf3835](https://github.com/finxol/karr/commit/fcf3835))
- Fix type checking ([dd6edf3](https://github.com/finxol/karr/commit/dd6edf3))
- Add pre-push linting and type checking
  ([3aebdc0](https://github.com/finxol/karr/commit/3aebdc0))
- Fix tsconfig root dir ([f8ae85a](https://github.com/finxol/karr/commit/f8ae85a))
- Update lockfile ([6f12cff](https://github.com/finxol/karr/commit/6f12cff))
- Build config before linting web
  ([88fff7a](https://github.com/finxol/karr/commit/88fff7a))
- Add formatting check ([025d8ee](https://github.com/finxol/karr/commit/025d8ee))
- Tmp remove format checking ([0b28752](https://github.com/finxol/karr/commit/0b28752))
- Rename job ([1098955](https://github.com/finxol/karr/commit/1098955))
- Split release pipeline into separate file
  ([b0cafec](https://github.com/finxol/karr/commit/b0cafec))
- Fix copy paste ([70d9658](https://github.com/finxol/karr/commit/70d9658))
- Debug prettier ([a22d870](https://github.com/finxol/karr/commit/a22d870))
- Debug prettier ([3cf46cd](https://github.com/finxol/karr/commit/3cf46cd))
- Debug prettier ([df154db](https://github.com/finxol/karr/commit/df154db))
- Debug prettier ([b610c49](https://github.com/finxol/karr/commit/b610c49))
- Debut prettier ([8076ed4](https://github.com/finxol/karr/commit/8076ed4))
- Debug prettier ([cad8f27](https://github.com/finxol/karr/commit/cad8f27))
- Debug prettier ([4bc4a1a](https://github.com/finxol/karr/commit/4bc4a1a))
- Debug prettier ([9cc5b08](https://github.com/finxol/karr/commit/9cc5b08))
- Fix prettier diff ([496c19a](https://github.com/finxol/karr/commit/496c19a))

#### ⚠️ Breaking Changes

- **config:** ⚠️ Remake config entirely
  ([4ce55e7](https://github.com/finxol/karr/commit/4ce55e7))
- **config:** ⚠️ Tests ([c2879fb](https://github.com/finxol/karr/commit/c2879fb))
- **config:** ⚠️ Move to confbox
  ([decb23e](https://github.com/finxol/karr/commit/decb23e))

### ❤️ Contributors

- Finxol <git@finxol.io>
