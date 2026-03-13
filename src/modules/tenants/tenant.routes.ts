import { Router } from "express"
import { validate } from "../../middlewares/validate.middleware"
import { registerTenantSchema } from "./tenant.schema"
import { Tenantcontroller } from "./tenant.controller"

const router = Router()

router.post(
    '/tenant-register',
    validate(registerTenantSchema),
    Tenantcontroller.registerTenant
)

export default router