export interface Transport {
    error: (message: string) => void
    warn: (message: string) => void
    info: (message: string) => void
    debug: (message: string) => void
}

export const stdio: Transport = {

    error: console.error,
    warn: console.warn,
    info: console.log,
    debug: console.debug,

};
