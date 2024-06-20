export function metadata() {

    return {
        date: new Date().toISOString(),
        pid: process.pid,
        ppid: process.ppid,
        nodeVersion: process.version,
    };

}
