import { z } from "zod";
import { paginationQuerySchema, paginationSchema } from "../../utils/common.schema";

const serviceBaseSchema = z.object({
  service_name: z
    .string()
    .min(4, "Service name should atleast contain 4 character"),

  service_description: z
    .string()
    .min(10, "Service description should atleast contain 10 character")
    .max(200, "Service description cannot be more then 200 character")
    .optional(),

  est_duration_min: z.number(),

  cost: z.number(),
});

// create
export const createServiceSchema = z.object({
  body: serviceBaseSchema,
});

// update
export const UpdateServiceSchema = z.object({
  params: z.object({
    service_id: z.string(),
  }),
  body: serviceBaseSchema.partial(),
});

export const DeleteGetServiceSchema = z.object({
  params: z.object({
    service_id: z.string(),
  }),
});

export const GetServiceListSchema = z.object({
  query: paginationQuerySchema.extend({
    sortBy: z
      .enum(["service_id", "service_name", "cost", "est_duration_min", "is_active"])
      .optional()
      .default("service_id"),
  })
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>["body"];
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>;
export type DeleteGetServiceInput = z.infer<typeof DeleteGetServiceSchema>;
export type GetServiceListInput = z.infer<typeof GetServiceListSchema>
