//Zod schema for the tenant registration
import { z } from "zod";

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

export type RegisterTenamtInput = z.infer<typeof registerTenantSchema>['body'];