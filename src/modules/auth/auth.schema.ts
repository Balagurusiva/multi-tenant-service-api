import { z } from "zod"

export const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid Email"),
        password : z.string().min(8, "Password should be minimum 8 character")
    })
})

export type LoginInput = z.infer<typeof loginSchema>['body'];