export interface Transport {
    stdout: (message: string) => void
    stderr: (message: string) => void
}

export const stdio: Transport = {

    stdout: console.log,
    stderr: console.error,

};
