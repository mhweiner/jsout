// Map of all aliases → canonical level
const levelAliases: Record<string, string> = {
    emerg: 'critical',
    alert: 'critical',
    critical: 'critical',
    fatal: 'critical',
    error: 'error',
    warn: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug',
};

export type Call = [level: string, message?: string, error?: any, data?: any];

type MockLogger = Record<string, (...args: any[]) => void> & {
    getCalls: () => Call[]
};

// eslint-disable-next-line max-lines-per-function
export function mockLoggerFactory(): MockLogger {

    const calls: Call[] = [];
    const logger: MockLogger = {
        getCalls: () => calls,
    };

    // Create a logger method for each alias
    for (const alias in levelAliases) {

        const level = levelAliases[alias];

        logger[alias] = (msg?: string, maybeErr?: any, maybeData?: any): void => {

            const isErrorLevel = ['critical', 'error', 'warning'].includes(level);

            const error = isErrorLevel ? maybeErr : undefined;
            const data = isErrorLevel ? maybeData : maybeErr;

            calls.push([level, msg, error, data]);

        };

    }

    return logger;

}
