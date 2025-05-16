FROM node:22-alpine AS base
LABEL maintainer="finxol <contact@finxol.io>"
LABEL repository="https://github.com/finxol/karr"

ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1
ENV HUSKY=0
# The port that the api listens to.
ENV PORT=1993
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
RUN turbo prune "@karr/api" --docker

#####################
### BUILDER STAGE ###
#####################
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV CI=true

# First install the dependencies (as they change less often)
COPY --from=installer /app/out/json/ .

# Copy necessary files for pnpm install to recognize patches
COPY --from=installer /app/package.json .
COPY --from=installer /app/pnpm-lock.yaml .
COPY --from=installer /app/patches ./patches


# Install dependencies - pnpm will use the root package.json for patch config
# and the workspace package.json files to determine what to install.
RUN pnpm install

COPY --from=installer /app/out/full/ .

# Build the project
RUN pnpm turbo run build:bundle

####################
### RUNNER STAGE ###
####################
FROM base AS runner

RUN apk add --no-cache bash

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner

COPY --from=installer --chown=runner:runner /app/apps/api/wait-for-it.sh /usr/local/bin/
RUN chmod 500 /usr/local/bin/wait-for-it.sh

RUN mkdir -p /app/.data
RUN chown runner:runner /app/.data

USER runner

COPY --from=builder --chown=runner:runner /app/apps/api/out/* .
# Copy migration files
COPY --from=builder --chown=runner:runner /app/apps/api/src/db/migrations ./migrations

ENV NODE_ENV=production
ENV DOCKER=1

CMD ["wait-for-it.sh", "db:5432", "-t", "15", "--", "node", "main.mjs"]
