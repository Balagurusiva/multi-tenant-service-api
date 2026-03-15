import { Router } from "express";
import { restrictTo } from "../../middlewares/auth.middlewares";
import { ServiceController } from "./service.controller";

const router = Router();

router.get("/", ServiceController.getServiceList);

router.post(
  "/create_service",
  restrictTo("ADMIN"),
  ServiceController.createService,
);

router.patch(
  "/update_service/:service_id",
  restrictTo("ADMIN"),
  ServiceController.updateService,
);

router.delete(
  "/:service_id",
  restrictTo("ADMIN"),
  ServiceController.deleteService,
);

router.get("/:service_id", ServiceController.getService);

export default router;
