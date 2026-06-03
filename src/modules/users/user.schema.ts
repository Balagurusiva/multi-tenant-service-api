import { z } from 'zod'
import { Role } from '../../types/global'
import { paginationQuerySchema, UserBaseSchema } from '../../utils/common.schema'

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
