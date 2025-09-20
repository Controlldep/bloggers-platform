
export const userViewModel = (user: any) => ({
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt
})