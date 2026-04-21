import { Router } from "express";
import { restrictTo } from "../../middlewares/auth.middlewares";
import { validate } from "../../middlewares/validate.middleware";
import { createTechnicianSchema, deleteTechnicianSchema, GetUserListSchema, updateTechnicianSchema } from "./user.schema";
import { UserController } from "./user.controller";
import { Role } from "../../types/global";

const router = Router()

router.get('/users',
    restrictTo(Role.ADMIN),
    validate(GetUserListSchema),
    UserController.getUserList
)

router.post('/technician',
    restrictTo(Role.ADMIN),
    validate(createTechnicianSchema),
    UserController.createTechnician
)

router.get('/technician/:user_id',
    restrictTo(Role.ADMIN, Role.TECHNICIAN),
    validate(deleteTechnicianSchema),
    UserController.getTechnician
)

router.patch('/technician/:user_id',
    restrictTo(Role.ADMIN, Role.TECHNICIAN),
    validate(updateTechnicianSchema),
    UserController.updateTechnician
)

router.delete('/technician/:user_id',
    restrictTo(Role.ADMIN),
    validate(deleteTechnicianSchema),
    UserController.deleteTechnician
)

export default router
