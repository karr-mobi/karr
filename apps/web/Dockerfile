FROM node:22-alpine AS base
LABEL maintainer="finxol <contact@finxol.io>"
LABEL repository="https://github.com/finxol/karr"

ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1
ENV HUSKY=0
ENV DOCKER=1

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

#######################
### INSTALLER STAGE ###
#######################
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
RUN pnpm add -g turbo@^2

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune "@karr/web" --docker

#####################
### BUILDER STAGE ###
#####################
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=installer /app/out/json/ .

# Copy necessary files for pnpm install to recognize patches
COPY --from=installer /app/package.json .
COPY --from=installer /app/pnpm-lock.yaml .
COPY --from=installer /app/patches ./patches

RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production
# Set required config values for the build
ENV CI=true

# Build the project
COPY --from=installer /app/out/full/ .
RUN pnpm run build

# Bundle migrations to run at container startup
RUN pnpm run --filter @karr/web migrations:bundle

####################
### RUNNER STAGE ###
####################
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache bash

ENV CONFIG_DIR="/app/config"
ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner

COPY --from=installer --chown=runner:runner /app/apps/web/wait-for-it.sh /usr/local/bin/
RUN chmod 500 /usr/local/bin/wait-for-it.sh

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=runner:runner /app/apps/web/.next/standalone ./
COPY --from=builder --chown=runner:runner /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=runner:runner /app/apps/web/public ./apps/web/public

# Copy over db migrations to run on startup
COPY --from=builder --chown=runner:runner /app/apps/web/out/db/migrate.mjs ./out/db/migrate.mjs
COPY --from=builder --chown=runner:runner /app/apps/web/migrations ./migrations

COPY --from=installer --chown=runner:runner /app/apps/web/docker-entrypoint.sh /usr/local/bin/
RUN chmod 500 /usr/local/bin/docker-entrypoint.sh

USER runner

CMD ["docker-entrypoint.sh"]
