<picture>
    <source srcset="docs/jsout.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/jsout-dark.svg" media="(prefers-color-scheme: light)">
    <img src="docs/jsout-dark.svg" alt="Logo" style="margin: 0 0 10px" size="250">
</picture>

[![build status](https://github.com/mhweiner/jsout/actions/workflows/release.yml/badge.svg)](https://github.com/mhweiner/jsout/actions)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)]()

A Syslog-compatible, small, and simple logger for Typescript/Javascript Node.js projects. Sponsored by [Aeroview](https://aeroview.io).

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

Configuration is set through environment variables. By default, the logger is set to `info` level and `json` format, which is recommended for production.

You can override these settings by setting the following environment variables before running your application.

For example, here are the recommended settings when running your application locally:

```bash
LOG=debug LOG_FORMAT=human ts-node /path/to/app.ts
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

# Logger API 

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

# Low-Level API

## log

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

# Why should logs use `STDOUT` and `STDERR`?

Logs should be emitted to `STDOUT` and `STDERR` for a few reasons:

1. **Decoupling Logging from the Application**: By emitting logs to STDOUT and STDERR, the application separates the concern of logging from its core functionality. This approach allows the application to focus solely on its primary tasks, while a separate process or system manages the logging. This decoupling enhances modularity and simplifies the application’s architecture.

2.  **Reliability and Robustness**: Handling logs within the application can introduce additional points of failure. If the process being monitored crashes, the logs may be lost, making it difficult to diagnose the issue. If the logging mechanism fails, it could potentially impact the application’s performance or even cause crashes. Emitting logs to STDOUT and STDERR ensures that the application remains unaffected by logging failures, as these standard streams are managed by the underlying operating system or container runtime.

3.  **Scalability and Flexibility**: Emitting logs to standard streams allows for greater scalability and flexibility. Logs can be easily redirected, aggregated, and processed by external tools or services designed specifically for log management. This approach supports various logging strategies without requiring changes to the application code, enabling seamless integration with diverse logging infrastructures.

4. **Simplified Deployment and Management**: Emitting logs to STDOUT and STDERR simplifies deployment and management processes. Applications do not need to be configured with complex logging libraries or dependencies, reducing the risk of configuration errors and simplifying the deployment pipeline. This also aligns well with containerized environments (e.g., Docker), where standard streams are commonly used for log collection and monitoring.

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
