# Karr Config Documentation

Default config can be found in `src/default_config.json`.

Configuration can be overridden by either a config file, or environment variables.

Order of precedence:
Env Var > Config File > Default

## Environment Variables

Any field in the default config can be set through environment variables.
The field should be specified in UPPER_CASE.

For example, the `application_name` in the default config should be written `APPLICATION_NAME`.

## Config file

the file can be either `.yaml`, `.yml` or `.json`, in this order of precedence.

```json
{{packages/config/src/default_config.json}}
```
