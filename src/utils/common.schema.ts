import { z } from "zod";

export const UserBaseSchema = z.object({
    user_name: z.string().min(4, "User name should have atleast 4 character"),
    role: z.enum(['ADMIN', 'TECHNICIAN', 'CUSTOMER']),
    email: z.email("Please enter valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(50),
    contact_no: z.string().min(10, "Please enter valid number"),
    address: z.string().min(20, "Address should contain atleast 20 character").max(100, "Address should not be more then 100 character"),
})

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().trim().optional().default(""),
    orderBy: z.enum(["asc", "desc", "1", "-1"]).optional().default("asc"),
});

export const paginationSchema = z.object({
    query: paginationQuerySchema,
});
