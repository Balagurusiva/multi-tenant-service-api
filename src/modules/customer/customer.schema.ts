import z from "zod";
import { UserBaseSchema } from "../../utils/common.schema";

export const createCustomerSchema = z.object({
    body: UserBaseSchema
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema.shape.body>