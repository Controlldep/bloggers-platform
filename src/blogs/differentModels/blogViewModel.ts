// TODO: добавить отдельный BlogViewModel с типизацией id: string
// TODO: переименовать blogViewModel → mapBlogToViewModel
// TODO: заменить any в параметре маппера на BlogDbModel
export const blogViewModel = (blog: any) => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
})