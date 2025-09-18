# Karr Caddy reverse proxy

This reverse proxy is only useful in the full-Docker setup.
It allows us to host the web/api and auth server on the same domain, routing traffic accordingly.

It is NOT useful when only one service is running on a domain. (e.g. web on Docker, auth server on Deno Deploy)
