export type Stub = ((...args: any[]) => void) & {
    getCalls: () => any[]
    clear: () => void
};

export function stub(): Stub {

    const calls: any[] = [];

    const fn = (...args: any[]) => {

        calls.push(args);

    };

    fn.getCalls = () => calls;
    fn.clear = () => {

        calls.length = 0;

    };

    return fn;

}
