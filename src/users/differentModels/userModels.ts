

export type userModel = {
    login: string,
    email: string,
    password: string,
    createdAt: string,
    confirmationCode: string | null,
    expirationDate: Date | null,
    isConfirmed: boolean
}
