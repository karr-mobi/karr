FROM node:22-alpine AS base
LABEL maintainer="finxol <contact@finxol.io>"
LABEL repository="https://github.com/finxol/karr"

ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST

ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

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
RUN turbo prune "@karr/landing" --docker

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
# Set required config values for the build
ENV CI=true

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
COPY --from=builder --chown=runner:runner /app/apps/landing/.next/standalone ./
COPY --from=builder --chown=runner:runner /app/apps/landing/.next/static ./apps/landing/.next/static
COPY --from=builder --chown=runner:runner /app/apps/landing/public ./apps/landing/public

USER runner

CMD ["node", "apps/landing/server.js"]
