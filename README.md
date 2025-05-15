<picture>
    <source srcset="docs/jsout.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/jsout-dark.svg" media="(prefers-color-scheme: light)">
    <img src="docs/jsout-dark.svg" alt="Logo" style="margin: 0 0 10px" size="250">
</picture>

[![build status](https://github.com/mhweiner/jsout/actions/workflows/release.yml/badge.svg)](https://github.com/mhweiner/jsout/actions)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)]()
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![AutoRel](https://img.shields.io/badge/AutoRel-1bd499)](https://github.com/mhweiner/autorel)


A Syslog-compatible, simple, structured logging tool for Node.js projects. Sponsored by [Aeroview](https://aeroview.io).

<picture>
    <source srcset="docs/error-screenshot.svg">
    <img src="docs/error-screenshot.svg" alt="Screenshot of error">
</picture>

## Features

**😃 Built for developer happiness & productivity**
- Automatic Error serialization
- Automatically removes noisy internal stack traces such as `node:internal/...`
- Colorized, formatted human-readable output for local development
- Supports [`Error.cause`](https://medium.com/ovrsea/power-up-your-node-js-debugging-and-error-handling-with-the-new-error-cause-feature-4136c563126a) for error chaining/traces across layers of your application

**🔒 Syslog Compatible Structured Logs**
- JSON output for log aggregation into services like [Aeroview](https://aeroview.io) and [CloudWatch](https://aws.amazon.com/cloudwatch/)
- Standardized [Syslog](https://datatracker.ietf.org/doc/html/rfc5424) log levels and output

**🛡 Defensive & DevOps Friendly**
- Production settings by default for safety
- Transport handled [outside of the process via `stdout` and `stderr`](#why-should-logs-use-stdout-and-stderr)
- Easy to use and simple configuration
- Only 1 small dependency. Fast & reliable TypeScript codebase
- Excellent test coverage (>90%)

## Installation

```bash
npm i jsout
```
 
## Example Usage

```typescript
import {logger} from 'jsout';

logger.info('test message');
logger.fatal('oops!', new Error(), {foo: 'bar'})
logger.error('', new Error('test')); //infers "test" as message
```

## Plugins

- [Express Request Logger](https://github.com/mhweiner/jsout-express)

## Configuration

Configuration is set through environment variables. 

By default, the logger is set to `info` level and `json` format, which is recommended for production.

We recommend using the following settings for local development:

```bash
LOG=debug LOG_FORMAT=cli node /path/to/app.js
```

### `LOG`

Sets the log level. Log levels are based on the [syslog](#api) levels. Values can be either the number or the string representation of the log level. Logs with a level less than the specified level will not be emitted.

For example, if the log level is set to `info`, logs with a level of `debug` will not be emitted.

**Possible values**:

| Number | String |
|-------|--------|
| `2`     | `critical` |
| `3`     | `error`    |
| `4`     | `warn`     |
| `5`     | `notice`   |
| `6`     | `info`     |
| `7`     | `debug`    |

**Default**: `info` (recommended for production)

### `LOG_FORMAT`

Set the format for the output to either be human-readable (great for local development in the console), or JSON formatted (great for data aggregation on a server).

**Possible values**: `cli`, `json`

**Default**: `json` (recommended for production)

## Logger API 

Log levels are based on the [syslog](https://datatracker.ietf.org/doc/html/rfc5424) levels:

| Level | Severity | Example |
|-------|------------|---------|
| 0     | Emergency      | <sup>System is unusable. Should not be used by typical applications.</sup> |
| 1     | Alert      | <sup>Action must be taken immediately to prevent system failure. For example, a process is down. Should not be used by typical applications.</sup> |
| 2     | Critical/Fatal       | <sup>Critical conditions. For example, a hard disk is full, or process is crashing. Unrecoverable errors.</sup> |
| 3     | Error        | <sup>Error conditions. For example, a failed request resulting in a 500 HTTP response.</sup> |
| 4     | Warning    | <sup>Warning conditions. For example, a process is using too much memory. Fully recoverable, not immediate issue.</sup> |
| 5     | Notice     | <sup>Normal but significant events that do not indicate a problem. Ie, a process is starting.</sup> |
| 6     | Informational       | <sup>General informational messages about normal operations.</sup> |
| 7     | Debug      | <sup>Debugging messages.</sup> |

These might be too granular for most applications, so here's what we recommend:

- **Emergency & Alert**: Reserved for infra-level logs. Should not be used by typical user applications.
- **Fatal**: Unrecoverable errors, such as a process crashing.
- **Error**: Recoverable errors, such as a failed request.
- **Warning**: 4xx HTTP responses, unexpected behavior, or potential issues.
- **Info**: Anything else that might be useful to debug the application. However, beware of logging sensitive information and overloading logs with too much information. This can get expensive and slow down your application.

For those functions that accept error objects, the `error` object is automatically serialized into a JSON object. `error` should be an instance of `Error` with a stack trace, but this is not enforced.

`data` is an object, containing any contextual information that might be useful to debug the error, or any pertinant information relating to the log message.

### Emergency (0)

- `logger.emerg(message?: string, error?: any, data?: any)`

### Alert (1)

- `logger.alert(message?: string, error?: any, data?: any)`

### Critical/Fatal (2)

- `logger.critical(message?: string, error?: any, data?: any)`
- `logger.fatal(message?: string, error?: any, data?: any)`

### Error (3)

- `logger.error(message?: string, error?: any, data?: any)`

### Warning (4)

- `logger.warn(message?: string, error?: any, data?: any)`

### Notice (5)

- `logger.notice(message?: string, data?: any)`

### Info (6)

- `logger.info(message?: string, data?: any)`

### Debug (7)

- `logger.debug(message?: string, data?: any)`

## Low-Level API

### `log`

`log(input: LogInput)`

The low-level API for logging. This is used by all the `logger` functions. For `LogInput` type, see [log.ts](blob/main/src/log.ts). You can use this function to build custom logging functions.

Example:

```typescript
import {log} from 'jsout';

log({
    level: 6,
    message: 'test message',
    data: {foo: 'bar'},
    options: {
        level: 'info',
        format: 'json',
    }
})
```

## Why should logs use `STDOUT` and `STDERR`?

Logs should be emitted to `STDOUT` and `STDERR` for a few reasons:

1. **Decoupling Logging from the Application**: 
    By emitting logs to STDOUT and STDERR, the application separates the concern of logging from its core functionality. This approach allows the application to focus solely on its primary tasks, while a separate process or system manages the logging. This decoupling enhances modularity and simplifies the application’s architecture.

2.  **Reliability and Robustness**: 
    Handling logs within the application can introduce additional points of failure. If the process being monitored crashes, the logs may be lost, making it difficult to diagnose the issue. If the logging mechanism fails, it could potentially impact the application’s performance or even cause crashes. Emitting logs to STDOUT and STDERR ensures that the application remains unaffected by logging failures, as these standard streams are managed by the underlying operating system or container runtime.

3.  **Scalability and Flexibility**: 
    Emitting logs to standard streams allows for greater scalability and flexibility. Logs can be easily redirected, aggregated, and processed by external tools or services designed specifically for log management. This approach supports various logging strategies without requiring changes to the application code, enabling seamless integration with diverse logging infrastructures.

4. **Simplified Deployment and Management**: 
    Emitting logs to STDOUT and STDERR simplifies deployment and management processes. Applications do not need to be configured with complex logging libraries or dependencies, reducing the risk of configuration errors and simplifying the deployment pipeline. This also aligns well with containerized environments (e.g., Docker), where standard streams are commonly used for log collection and monitoring.

## Contributing

- ⭐ Star this repo if you like it!
- 🐛 Open an [issue](https://github.com/mhweiner/jsout/issues) for bugs or suggestions.
- 🤝 Submit a PR to `main` — all tests must pass.

## Related Projects

- [autorel](https://github.com/mhweiner/autorel): Automate semantic releases based on conventional commits.
- [hoare](https://github.com/mhweiner/hoare): A fast, defensive test runner for JS/TS.
- [brek](https://github.com/mhweiner/brek): Typed config loader for dynamic, secret-based configs.
- [pgsmith](https://github.com/mhweiner/pgsmith): A SQL builder for parameterized queries in PostgreSQL.
