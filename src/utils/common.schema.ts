import { z } from "zod";

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().trim().optional().default(""),
    orderBy: z.enum(["asc", "desc", "1", "-1"]).optional().default("asc"),
});

export const paginationSchema = z.object({
    query: paginationQuerySchema,
});
