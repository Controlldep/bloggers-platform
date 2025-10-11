
export type sessionViewModel = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}


export const sessionMapper = (session: any): sessionViewModel => {
    return {
        ip: session.ip,
        title: session.deviceTitle,
        lastActiveDate: session.lastActiveDate,
        deviceId: session.deviceId,
    };
};