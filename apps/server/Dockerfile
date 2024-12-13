FROM caddy:2

COPY Caddyfile /etc/caddy/Caddyfile

ENV SITE_ADDRESS=":80"
ENV API_PORT="8080"

#  Check provided Caddy configuration
RUN caddy validate -c /etc/caddy/Caddyfile
RUN caddy fmt /etc/caddy/Caddyfile
