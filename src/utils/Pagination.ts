import { Model } from "mongoose"

type OrderBy = 'asc' | 'desc' | '1' | '-1'

type PaginateOptions = {
    model: Model<any>;
    filter: Record<string, any>;
    select?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    orderBy?: OrderBy;
    allowedSortFeilds?: string[];
    defaultSortBy?: string;
    map?: (item: any) => any
}

export async function paginate({
    model,
    filter,
    select,
    page = 1,
    limit = 10,
    sortBy,
    orderBy = 'asc',
    allowedSortFeilds,
    defaultSortBy,
    map
}: PaginateOptions) {
    const currentPage = Math.max(1, page);
    const intemsPerPage = Math.max(1, limit);
    const skip = (currentPage - 1) * intemsPerPage;

    const safeSortBy = allowedSortFeilds && sortBy && allowedSortFeilds.includes(sortBy) ? sortBy : defaultSortBy;
    const sortDirection: 1 | -1 = orderBy === 'desc' || orderBy === '-1' ? -1 : 1;

    const [docs, totalRecords] = await Promise.all([
        model
            .find(filter, select)
            .sort(safeSortBy ? { [safeSortBy]: sortDirection } : undefined)
            .skip(skip)
            .limit(intemsPerPage)
            .lean(),
        model.countDocuments(filter)
    ])

    const data = map ? docs.map(map) : docs;
    const totalPages = Math.ceil(totalRecords / intemsPerPage);

    return {
        data,
        metadata: {
            totalRecords,
            currentPage,
            intemsPerPage,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        }
    }
}