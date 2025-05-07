export type Stub = ((...args: any[]) => void) & {
    getCalls: () => any[]
    clear: () => void
};

export function stub(): Stub {

    const calls: any[] = [];

    const fn = (...args: any[]): void => {

        calls.push(args);

    };

    fn.getCalls = (): any[] => calls;
    fn.clear = (): void => {

        calls.length = 0;

    };

    return fn;

}
