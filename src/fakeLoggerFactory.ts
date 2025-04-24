// eslint-disable-next-line max-lines-per-function
export function mockLoggerFactory(): {
    emerg: (message?: string, error?: any, data?: any) => void
    alert: (message?: string, error?: any, data?: any) => void
    crit: (message?: string, error?: any, data?: any) => void
    critical: (message?: string, error?: any, data?: any) => void
    fatal: (message?: string, error?: any, data?: any) => void
    err: (message?: string, error?: any, data?: any) => void
    error: (message?: string, error?: any, data?: any) => void
    warn: (message?: string, error?: any, data?: any) => void
    warning: (message?: string, error?: any, data?: any) => void
    notice: (message?: string, data?: any) => void
    info: (message?: string, data?: any) => void
    debug: (message?: string, data?: any) => void
    getCalls: () => [level: string, message?: string, error?: any, data?: any][]
} {

    const calls: [string, string?, any?, any?][] = [];

    const log = (level: string, message?: string, errorOrData?: any, maybeData?: any) => {

        const isErrorLog = ['emerg', 'alert', 'crit', 'critical', 'fatal', 'err', 'error', 'warn', 'warning'].includes(level);
        const error = isErrorLog ? errorOrData : undefined;
        const data = isErrorLog ? maybeData : errorOrData;

        calls.push([level, message, error, data]);

    };

    return {
        emerg: (m, e, d) => log('emerg', m, e, d),
        alert: (m, e, d) => log('alert', m, e, d),
        crit: (m, e, d) => log('crit', m, e, d),
        critical: (m, e, d) => log('critical', m, e, d),
        fatal: (m, e, d) => log('fatal', m, e, d),
        err: (m, e, d) => log('err', m, e, d),
        error: (m, e, d) => log('error', m, e, d),
        warn: (m, e, d) => log('warn', m, e, d),
        warning: (m, e, d) => log('warning', m, e, d),
        notice: (m, d) => log('notice', m, d),
        info: (m, d) => log('info', m, d),
        debug: (m, d) => log('debug', m, d),
        getCalls: () => calls,
    };

}
