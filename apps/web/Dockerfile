FROM node:22-alpine AS base
LABEL maintainer="finxol <contact@finxol.io>"
LABEL repository="https://github.com/finxol/karr"

ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1
ENV HUSKY=0
# The port that the api listens to.
ENV APP_URL=http://localhost
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
RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production

# Build the project
COPY --from=installer /app/out/full/ .
RUN pnpm run build

####################
### RUNNER STAGE ###
####################
FROM base AS runner
WORKDIR /app

ENV CONFIG_DIR="/app/config"
ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=runner:runner /app/apps/web/.next/standalone ./
COPY --from=builder --chown=runner:runner /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=runner:runner /app/apps/web/public ./apps/web/public

USER runner

CMD ["node", "apps/web/server.js"]
