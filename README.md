<picture>
    <source srcset="docs/jsout.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/jsout-dark.svg" media="(prefers-color-scheme: light)">
    <img src="docs/jsout-dark.svg" alt="Logo" style="margin: 0 0 10px" size="250">
</picture>

[![build status](https://github.com/mhweiner/jsout/actions/workflows/release.yml/badge.svg)](https://github.com/mhweiner/jsout/actions)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)]()

A Syslog-compatible, small, and simple logger for Typescript/Javascript projects. Sponsored by [Aeroview](https://aeroview.io).

**🔒 Structured Logs**
- Supports both human-readable CLI output and JSON output for log aggregation into services like Sumo Logic, New Relic, Datadog, and Aeroview.

**✅ Syslog Compatible**

- Standardized [Syslog](https://datatracker.ietf.org/doc/html/rfc5424) log levels and output format make it easy to integrate with existing logging pipelines and 3rd party services.

**🛡 Defensive & Devops Friendly**
- Logs are enabled in production mode by default, avoding the mistake of forgetting to enable logs in production which could be disastrous.
- Transport should be handled [outside of the process](#why-should-logs-use-stdout-and-stderr) via `STDOUT` and `STDERR`
- Simple configurations makes it hard to mess up
- Minimal dependencies, fast, and reliable TypeScript codebase

**😃 Simple & Easy to Use**
- Automatic Error serialization
- Out-of-the-box Typescript support
- Nice human readable output

**💪 Flexible & Powerful**
- Easily set configuration using simple CLI overrides
- Simple and well-defined enough to build custom tooling around, such as plugins, custom error handling, and logging pipelines.

# Installation

```bash
npm i jsout
```
 
# Example Usage

```typescript
import {logger} from 'jsout';

logger.info('test message');
logger.fatal('oops!', new Error(), {foo: 'bar'})
logger.error('', new Error('test')); //infers "test" as message
```

# Plugins

- [Express Request Logger](https://github.com/mhweiner/jsout-express)

# Configuration

Configuration is set through the CLI environment variables. By default, the logger is set to `info` level, `json` format, and `verbose` verbosity, which is recommended for production.

You can override these settings by setting the following environment variables before running your application.

For example, here is the recommended way to run your application locally:

```bash
LOG=debug LOG_FORMAT=human node /path/to/yourApp.js
```

## `LOG`

Sets the log level. Log levels are based on the [syslog](#api) levels. Values can be either the number or the string representation of the log level. Logs with a level less than the specified level will not be emitted.

For example, if the log level is set to `info`, logs with a level of `debug` will not be emitted.

**Possible values**: 

`2`, `3`, `4`, `5`, `6`, `7`

_OR_

`"crit"`, `"critical"` `"err"`, `"error"`, `"warning"`, `"warn"`, `"notice"`, `"info"`, `"debug"`

**Default**: `"info"` (recommended for production)

## `LOG_FORMAT`

Set the format for the output to either be human-readable (great for local development in the console), or JSON formatted (great for data aggregation on a server).

**Possible values**: `"human"`, `"json"`

**Default**: `"json"` (recommended for production)

# API

Log levels are based on the [syslog](https://datatracker.ietf.org/doc/html/rfc5424) levels:

| Level | Severity | Example |
|-------|------------|---------|
| 0     | Emergency      | System is unusable. Should not be used by applications. |
| 1     | Alert      | Action must be taken immediately to prevent system failure. For example, a process is down. |
| 2     | Critical       | Critical conditions. For example, a hard disk is full, or process is crashing. |
| 3     | Error        | Error conditions. For example, a file is missing. |
| 4     | Warning    | Warning conditions. For example, a process is using too much memory. |
| 5     | Notice     | Normal but significant events that do not indicate a problem. Ie, a process is starting. |
| 6     | Informational       | General informational messages about normal operations. |
| 7     | Debug      | Debugging messages. |

These might be a bit too granular for most applications, but they are present to be `syslog` compatible. 

__We recommend using `info` for most logs, `warn` for warnings, `error` for recoverable errors, and `fatal` (an alias for `critical`) for unrecoverable errors.__

For those functions that accept error objects, the `error` object is automatically serialized into a JSON object. `error` should be an instance of `Error` with a stack trace, but this is not enforced.

`data` is any object that might be useful to debug the error, or any pertinant information relating to the log message.

## Emergency (0)

- `logger.emerg(message?: string, error?: any, data?: any)`

## Alert (1)

- `logger.alert(message?: string, error?: any, data?: any)`

## Critical/Fatal (2)

- `logger.crit(message?: string, error?: any, data?: any)`
- `logger.critical(message?: string, error?: any, data?: any)`
- `logger.fatal(message?: string, error?: any, data?: any)`

## Error (3)

- `logger.err(message?: string, error?: any, data?: any)`
- `logger.error(message?: string, error?: any, data?: any)`

## Warning (4)

- `logger.warn(message?: string, error?: any, data?: any)`
- `logger.warning(message?: string, error?: any, data?: any)`

## Notice (5)

- `logger.notice(message?: string, data?: any)`

## Info (6)

- `logger.info(message?: string, data?: any)`

## Debug (7)

- `logger.debug(message?: string, data?: any)`

# Why should logs use `STDOUT` and `STDERR`?

Logs should be emitted to `STDOUT` and `STDERR` for a few reasons:

1. **Separation of Concerns**: Logs should be handled by a separate process, not the application itself. This allows for better error handling and logging, and prevents the application from crashing due to logging errors.

2. **Standardization**: `STDOUT` and `STDERR` are standard streams that are used by many logging tools and services. By emitting logs to these streams, you can easily integrate with existing logging pipelines and services.

3. **Reliability**: By emitting logs to `STDOUT` and `STDERR`, you can ensure that logs are captured and processed even if the application crashes or exits unexpectedly.

# Support, Feedback, and Contributions

- Star this repo if you like it!
- Submit an [issue](https://github.com/mhweiner/jsout/issues) with your problem, feature request or bug report
- Issue a PR against `main` and request review. Make sure all tests pass and coverage is good.
- Write about `jsout` in your blog, tweet about it, or share it with your friends!

Together we can make software more reliable and easier to maintain!

# Sponsors

<picture>
    <source srcset="docs/aeroview-logo-lockup.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/aeroview-logo-lockup-dark.svg" media="(prefers-color-scheme: light)">
    <img src="docs/aeroview-logo-lockup-dark.svg" alt="Logo" style="max-width: 150px;margin: 0 0 10px">
</picture>

Aeroview is a developer-friendly, AI-powered observability platform that helps you monitor, troubleshoot, and optimize your applications. Get started for free at [https://aeroview.io](https://aeroview.io).
