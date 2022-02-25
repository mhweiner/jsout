# jsout

[![build status](https://github.com/mhweiner/jsout/actions/workflows/workflow.yml/badge.svg)](https://github.com/mhweiner/jsout/actions)
[![semantic-release](https://img.shields.io/badge/semantic--release-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)]()

A small & simple logger for Typescript & Javascript projects. Does everything you need, nothing you don't. DevOps friendly.

**Structured Logs 🔒**
- Supports both human-readable CLI output and JSON output for log aggregation into services like sumologic, New Relic, DataDog, etc.

**Defensive & Devops Friendly 🛡**
- Logs are enabled in production mode by default
- Doesn't allow for fancy configurations that are easy to get wrong. Logging should be easy and simple.
- Transport should be handled outside of the process, not inside (this is the job of DevOps)
- Configuration should also be handled outside of the code, not inside. This is also the job of DevOps.

**Crazy Simple & Easy to Use 😃**
- Out-of-the-box Typescript support
- Only 2 tiny dependencies, written in clean Typescript
- Nice human readable output

**Flexible & Powerful 💪**
- Easily set configuration using simple CLI overrides
- Simple and well-defined enough to build custom tooling around, such as custom error handling and logging pipelines.

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

## Configuration

Configuration is set through the CLI environment variables (aka `process.env` variables in node.js). For example, here is a recommended setup for local development:

```bash
LOG=debug LOG_FORMAT=human LOG_VERBOSITY=terse node /path/to/yourApp.js
```

### `process.env.LOG`

Sets the log level. Any logs lower than this log level are ignored.

**Possible values**: `"trace"`, `"debug"`, `"info"`, `"warn"`, `"error"`, `"fatal"`

**Default**: `"info"` (recommended for production)

### `process.env.LOG_FORMAT`

Set the format for the output to either be human-readable (great for local development in the console), or JSON formatted (great for data aggregation on a server).

**Possible values**: `"human"`, `"json"`

**Default**: `"json"` (recommended for production)

### `process.env.LOG_VERBOSITY`

If verbose, extra metadata is appended to `log.context`. Example:

```json
{
  date: '2021-12-19T06:17:38.147Z',
  pid: 71971,
  ppid: 71970,
  nodeVersion: 'v16.13.0'
}
```

**Possible values**: `"terse"`, `"verbose"`

**Default**: `"verbose"` (recommended for production)

## API

For all of the following, please note:

- `error` should be an actual error with stack traces. This is not enforced is usually best practice.
- `context` should by any information not necessarily directly related to the error, ie. server request information, app component, configurations, etc. This is where the [verbose metadata](#processenvlog_verbosity) is appended (this will override anything in the context object).
- `data` any object that might be useful to debug the error, or any pertinant information relating to the log message

### `logger.trace(message?: string, data?: any, context?: any)`

Emits a log to `stdout` with a level of `TRACE (10)`

### `logger.debug(message?: string, data?: any, context?: any)`

Emits a log to `stdout` with a level of `DEBUG (20)`

### `logger.info(message?: string, data?: any, context?: any)`

Emits a log to `stdout` with a level of `INFO (30)`

### `logger.warn(message?: string, error?: any, data?: any, context?: any)`

Emits a log to `stderr` with a level of `WARN (40)`

### `logger.error(message?: string, error?: any, data?: any, context?: any)`

Emits a log to `stderr` with a level of `ERROR (50)`

### `logger.fatal(message?: string, error?: any, data?: any, context?: any)`

Emits a log to `stderr` with a level of `FATAL (60)`

## Contribution

Please contribute to this project! Issue a PR against `master` and request review. 

- Please test your work thoroughly.
- Make sure all tests pass with appropriate coverage.

### How to build locally

```bash
npm i
```

### Running tests

```shell script
npm test
```
