deno cache --node-modules-dir npm:drizzle-orm
deno cache --node-modules-dir npm:drizzle-kit
deno run -A --node-modules-dir npm:drizzle-kit push
