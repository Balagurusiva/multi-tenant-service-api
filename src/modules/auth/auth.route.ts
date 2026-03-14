import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema } from "./auth.schema";
import { AuthController } from "./auth.controller";
import { authLimiter } from "../../middlewares/rateLimit.middleware";

const router = Router()

router.post('/login', authLimiter, validate(loginSchema), AuthController.login)

export default router;