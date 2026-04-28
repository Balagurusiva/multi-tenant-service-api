import { z } from 'zod'
import { Role } from '../../types/global'
import { paginationQuerySchema } from '../../utils/common.schema'


const UserBaseSchema = z.object({
    user_name: z.string().min(4, "User name should have atleast 4 character"),
    role: z.enum(['ADMIN', 'TECHNICIAN', 'CUSTOMER']),
    email: z.email("Please enter valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(50),
    contact_no: z.string().min(10, "Please enter valid number"),
    address: z.string().min(20, "Address should contain atleast 20 character").max(100, "Address should not be more then 100 character"),
})

export const createTechnicianSchema = z.object({
    body: UserBaseSchema.omit({ role: true }).strict()
})

export const updateTechnicianSchema = z.object({
    params: z.object({
        user_id: z.string()
    }),
    body: UserBaseSchema.omit({ role: true }).partial().strict()
})

export const deleteTechnicianSchema = z.object({
    params: z.object({
        user_id: z.string()
    })
})

export const GetUserListSchema = z.object({
    query: paginationQuerySchema.extend({
        role: z.enum([Role.TECHNICIAN, "CUSTOMER"]),
        sortBy: z.enum([
            "user_id",
            "user_name",
            "email",
        ])
            .optional()
            .default("user_id"),
    })
})



export type CreateTechnicianInput = z.infer<typeof createTechnicianSchema.shape.body>
export type UpdateTechnicianInput = z.infer<typeof updateTechnicianSchema.shape.body>
export type GetUserListInput = z.infer<typeof GetUserListSchema>
export type GetTechnicianInput = z.infer<typeof deleteTechnicianSchema>
