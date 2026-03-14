import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema } from "./auth.schema";
import { AuthController } from "./auth.controller";

const router = Router()

router.post('/login', validate(loginSchema), AuthController.login)

export default router;