FROM denoland/deno:alpine-2.1.4

WORKDIR /app
# make /app belong to deno user
RUN chown -R deno:deno /app

RUN apk add bash

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY --chown=deno:deno deno.json deno.lock ./

# These steps will be re-run upon each file change in your working directory:
COPY --chown=deno:deno packages packages
COPY --chown=deno:deno apps/api apps/api
COPY --chown=deno:deno apps/auth/deno.json ./apps/auth/deno.json

WORKDIR /app/apps/api

# The port that your application listens to.
EXPOSE 1993
ENV PORT=1993

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache ./src/main.ts

COPY --chown=deno:deno ./wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-it.sh

CMD ["wait-for-it.sh", "db:5432", "-t", "10", "--", "deno", "task", "start"]
