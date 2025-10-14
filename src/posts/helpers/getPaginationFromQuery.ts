
import {paginationQueryInputModel} from "../differentModels/paginationQueryInputModel";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";

export const getPaginationFromQuery = (query: paginationQueryInputModel): paginationQueryOutputModel => {
    const pageNumber: number = query.pageNumber ? Number(query.pageNumber) : 1
    const pageSize: number = query.pageSize ? Number(query.pageSize) : 10
    const sortBy: string = query.sortBy ?? 'createdAt'
    const sortDirection: "asc" | "desc" = query.sortDirection === 'asc' ? 'asc' : 'desc'
    const searchNameTerm: string | null =
        query.searchNameTerm && query.searchNameTerm.trim() !== ''
            ? query.searchNameTerm.trim()
            : null
    return { pageNumber, pageSize, sortBy, sortDirection , searchNameTerm}
}