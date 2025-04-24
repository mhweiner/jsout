// Map of all aliases → canonical level
const levelAliases: Record<string, string> = {
    emerg: 'critical',
    alert: 'critical',
    crit: 'critical',
    critical: 'critical',
    fatal: 'critical',
    err: 'error',
    error: 'error',
    warn: 'warning',
    warning: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug',
};

export type Call = [level: string, message?: string, error?: any, data?: any];

// eslint-disable-next-line max-lines-per-function
export function mockLoggerFactory() {

    const calls: Call[] = [];

    const logger: Record<string, (...args: any[]) => void> = {
        getCalls: () => calls,
    };

    // Create a logger method for each alias
    for (const alias in levelAliases) {

        const level = levelAliases[alias];

        logger[alias] = (msg?: string, maybeErr?: any, maybeData?: any) => {

            const isErrorLevel = ['critical', 'error', 'warning'].includes(level);

            const error = isErrorLevel ? maybeErr : undefined;
            const data = isErrorLevel ? maybeData : maybeErr;

            calls.push([level, msg, error, data]);

        };

    }

    return logger as typeof logger & {
        getCalls: () => Call[]
    };

}
