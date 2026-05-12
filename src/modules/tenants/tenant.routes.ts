import { Router } from "express"
import { validate } from "../../middlewares/validate.middleware"
import { getTenantsListSchema, registerTenantSchema } from "./tenant.schema"
import { TenantController } from "./tenant.controller"

const router = Router()

router.post(
    '/tenant-register',
    validate(registerTenantSchema),
    TenantController.registerTenant
)

router.get(
    './tenants',
    validate(getTenantsListSchema),
    TenantController.getTenantsList
)

// router.get(
//     './tenants/:slug',
//     validate(getTenantSchema),
//     Tenantcontroller.getTenant
// )

// router.get(
//     './tenant/:slug/services',
//     validate(getTenantServicesSchema),
//     Tenantcontroller.getTenantServices
// )

export default router