import { NextFunction, Request, Response } from "express";
import { TenantService } from "./tenant.service";
import { catchAsync } from "../../utils/CatchAsync";
import { ApiResponse } from "../../utils/ApiResponse";

export class TenantController {
    static registerTenant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TenantService.createTenantAndAdmin(req.body);
        ApiResponse.send(res, 201, "Organization created successfully", result);
    })

    static getTenantsList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    })
}