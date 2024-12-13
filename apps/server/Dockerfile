FROM caddy:2

COPY Caddyfile /etc/caddy/Caddyfile

#  Check provided configuration
RUN caddy validate -c /etc/caddy/Caddyfile
RUN caddy fmt /etc/caddy/Caddyfile
