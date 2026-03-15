import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { ServiceService } from "./service.service";
import { ApiResponse } from "../../utils/ApiResponse";

export class ServiceController {
  static getServiceList = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let result = await ServiceService.getServicesList(req.user!.tenant_id);
      ApiResponse.send(res, 200, "", result);
    },
  );

  static createService = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let result = await ServiceService.createService(
        req.user!.tenant_id,
        req.body,
      );
      ApiResponse.send(res, 200, "Service Created Successfully", result);
    },
  );

  static updateService = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let result = await ServiceService.updateService(req.user!.tenant_id, {
        params: req.params as { service_id: string },
        body: req.body,
      });

      ApiResponse.send(res, 200, "Service Updated Successfully", result);
    },
  );

  static deleteService = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      await ServiceService.deleteService(req.user!.tenant_id, {
        params: req.params as { service_id: string },
      });

      ApiResponse.send(res, 200, "Service Deleted Successfully");
    },
  );

  static getService = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let result = await ServiceService.getService(req.user!.tenant_id, {
        params: req.params as { service_id: string },
      });

      ApiResponse.send(res, 200, "", result);
    },
  );
}
