import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { createCustomerSchema } from "./customer.schema";
import { CustomerController } from "./customer.controller";

const router = Router()

router.post('/register',
    validate(createCustomerSchema),
    CustomerController.createCustomer
)


export default router;