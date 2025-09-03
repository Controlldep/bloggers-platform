

export type ValidationError = {
    errorsMessages: {
        field: string,
        message: string,
    }[]
};