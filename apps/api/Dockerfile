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

# First install the dependencies (as they change less often)
COPY --from=installer /app/out/json/ .
RUN pnpm install

COPY --from=installer /app/out/full/ .

# Build the project
RUN pnpm run build

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

USER runner

COPY --from=builder --chown=runner:runner /app/apps/api/out/index.min.mjs ./index.min.mjs
# Copy migration files
COPY --from=builder --chown=runner:runner /app/packages/db/migrations ./migrations

ENV NODE_ENV=production
ENV DOCKER=1

CMD ["wait-for-it.sh", "db:5432", "-t", "15", "--", "node", "index.min.mjs"]
