
export type RefreshPayload = {
    userId: string
    deviceId: string
    jti: string
    iat: number
    exp: number
}