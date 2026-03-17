import { Router } from "express";
import { restrictTo } from "../../middlewares/auth.middlewares";
import { validate } from "../../middlewares/validate.middleware";
import { ServiceController } from "./service.controller";
import {
  createServiceSchema,
  DeleteGetServiceSchema,
  GetServiceListSchema,
  UpdateServiceSchema,
} from "./service.schema";

const router = Router();

router.get("/", validate(GetServiceListSchema), ServiceController.getServiceList);

router.post(
  "/create_service",
  restrictTo("ADMIN"),
  validate(createServiceSchema),
  ServiceController.createService,
);

router.patch(
  "/update_service/:service_id",
  restrictTo("ADMIN"),
  validate(UpdateServiceSchema),
  ServiceController.updateService,
);

router.delete(
  "/:service_id",
  restrictTo("ADMIN"),
  validate(DeleteGetServiceSchema),
  ServiceController.deleteService,
);

router.get("/:service_id", validate(DeleteGetServiceSchema), ServiceController.getService);

export default router;
