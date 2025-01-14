# Karr Config Documentation

Default config can be found in `src/default_config.json`.

Configuration can be overridden by either a config file, or environment variables.

Order of precedence: Env Var > Config File > Default

## Environment Variables

Any field in the default config can be set through environment variables. The field should
be specified in UPPER_CASE.

For example, the `DbConfig.port` in the default config should be written `DB_PORT`.

## Config file

Is loaded with [`c12`](https://github.com/unjs/c12). Refer to their docs for more info

```json
{{packages/config/src/default_config.json}}
```

## Directory structure

### src

- `config.ts`: entrypoint for config access
- `default_config.json`: all default configuration values (doesn't include database, needs
  to be defined by admin)
- `schema.ts`: Schemas and types for all config
- `static.ts`: all static config, hard coded, only change on codebase change
- `utils.ts`: helper utilities
- `test/`:All tests for config package

## Possible environment variables

- CONFIG_DIR
- CONFIG_FILE
- DB_HOST
- DB_PORT
- DB_SSL
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_PASSWORD_FILE
- API_PORT
- LOG_TIMESTAMP
- LOG_LEVEL
- ADMIN_EMAIL
