import { Router } from "express"
import { validate } from "../../middlewares/validate.middleware"
import { getTenantSchema, getTenantServicesSchema, getTenantsListSchema, registerTenantSchema } from "./tenant.schema"
import { TenantController } from "./tenant.controller"

const router = Router()

router.post(
    '/tenant-register',
    validate(registerTenantSchema),
    TenantController.registerTenant
)

router.get(
    '/tenants',
    validate(getTenantsListSchema),
    TenantController.getTenantsList
)

router.get(
    '/tenants/:slug',
    validate(getTenantSchema),
    TenantController.getTenant
)

router.get(
    '/tenants/:slug/service',
    validate(getTenantServicesSchema),
    TenantController.getTenantServices
)

export default router