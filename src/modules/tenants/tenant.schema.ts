//Zod schema for the tenant registration
import { z } from "zod";
import { paginationQuerySchema, paginationSchema } from "../../utils/common.schema";

export const registerTenantSchema = z.object({
  body: z.object({
    OrgName: z
      .string()
      .min(2, "Organization name is too short")
      .max(50, "Organization name is too long"),

    orgSlug: z
      .string()
      .min(2, "Slug is too short")
      .max(50)
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),

    adminName: z
      .string()
      .min(2, "Admin name must be at least 2 characters")
      .max(50),

    adminEmail: z.email("Invalid email"),

    adminPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50),

    adminContactNo: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Contact number must be a valid 10 digit Indian mobile number"),

    adminAddress: z
      .string()
      .min(10, "Address must be at least 10 characters")
      .max(255, "Address is too long"),
  }),
});

export const getTenantsListSchema = z.object({
  query: paginationQuerySchema.extend({
    sortBy: z
      .enum(["name", "slug"])
      .optional()
      .default("name"),
  })
});

export const getTenantSchema = z.object({
  params: z.object({
    slug: z.string()
  })
})

export const getTenantServicesSchema = z.object({
  params: z.object({
    slug: z.string()
  }),
  query: paginationQuerySchema.extend({
    sortBy: z
      .enum(["service_id", "service_name", "cost", "est_duration_min", "is_active"])
      .optional()
      .default("service_id"),
  })
});

export type RegisterTenantInput = z.infer<typeof registerTenantSchema>['body'];
export type GetTenantListInput = z.infer<typeof getTenantsListSchema>['query'];
export type GetTenantInput = z.infer<typeof getTenantSchema>['params']
export type GetTenantServicesInput = z.infer<typeof getTenantServicesSchema>
