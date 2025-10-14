
export type paginationQueryOutputModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: "asc" | "desc"
    searchNameTerm: string | null
}