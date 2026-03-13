import { NextFunction, Request, Response } from "express";
import { TenantSerive } from "./tenant.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/apiResponse";

export class Tenantcontroller{
    static registerTenant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TenantSerive.createTanentAndAdmin(req.body);
        ApiResponse.send(res, 201, "Organization created successfully", result);
    })
}